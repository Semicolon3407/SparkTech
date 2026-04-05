import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/order';
import PendingOrder from '@/lib/db/models/pending-order';
import { verifyToken } from '@/lib/auth/jwt';
import { OrderService } from '@/lib/services/order-service';

// eSewa UAT credentials
const ESEWA_CONFIG = {
  MERCHANT_CODE: 'EPAYTEST',
  SECRET_KEY: '8gBm/:&EnhH.1/q', // Official UAT Secret Key
  GATEWAY_URL: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
};

// Khalti Sandbox credentials
const KHALTI_CONFIG = {
  SECRET_KEY: '05bf95cc57244045b8df5fad06748dab', // Sample sandbox key from docs
  BASE_URL: 'https://dev.khalti.com/api/v2',
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    // Find all orders for user
    const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orderData = await req.json();

    if (orderData.paymentMethod === 'esewa') {
      // Create a pending order instead of a real one
      const pendingOrder = await PendingOrder.create({
        user: decoded.userId,
        orderData: {
          ...orderData,
          user: decoded.userId,
        }
      });

      // Prepare eSewa signature
      const transaction_uuid = `PEND-${pendingOrder._id}`;
      const totalAmountStr = orderData.total.toString();
      const productCodeStr = ESEWA_CONFIG.MERCHANT_CODE;
      
      const signatureString = `total_amount=${totalAmountStr},transaction_uuid=${transaction_uuid},product_code=${productCodeStr}`;
      
      const signature = crypto
        .createHmac('sha256', ESEWA_CONFIG.SECRET_KEY)
        .update(signatureString)
        .digest('base64');

      const esewaParams = {
        // eSewa requires total_amount = amount + tax_amount + product_service_charge + product_delivery_charge
        // We calculate 'amount' backwards from the total to ensure discount is properly applied within eSewa's strict validation
        amount: (orderData.total - orderData.tax - orderData.shippingCost).toString(),
        tax_amount: orderData.tax.toString(),
        product_service_charge: "0",
        product_delivery_charge: orderData.shippingCost.toString(),
        total_amount: totalAmountStr,
        transaction_uuid: transaction_uuid,
        product_code: productCodeStr,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/payment-callback/esewa`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
      };


      return NextResponse.json({
        success: true,
        data: { _id: pendingOrder._id },
        paymentUrl: ESEWA_CONFIG.GATEWAY_URL,
        paymentParams: esewaParams,
      });
    }

    if (orderData.paymentMethod === 'khalti') {
      // Create a pending order
      const pendingOrder = await PendingOrder.create({
        user: decoded.userId,
        orderData: {
          ...orderData,
          user: decoded.userId,
        }
      });

      // Initiate Khalti payment
      const response = await fetch(`${KHALTI_CONFIG.BASE_URL}/epayment/initiate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${KHALTI_CONFIG.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/payment-callback/khalti`,
          website_url: process.env.NEXT_PUBLIC_APP_URL,
          amount: Math.round(orderData.total * 100), // Convert to Paisa
          purchase_order_id: pendingOrder._id.toString(),
          purchase_order_name: `Order #${pendingOrder._id}`,
          customer_info: {
            name: orderData.shippingAddress.fullName,
            email: decoded.email || 'customer@example.com',
            phone: orderData.shippingAddress.phone,
          }
        }),
      });

      const khaltiData = await response.json();

      if (!response.ok) {
        console.error('Khalti Initiation Error:', khaltiData);
        throw new Error(khaltiData.detail || 'Failed to initiate Khalti payment');
      }

      return NextResponse.json({
        success: true,
        data: { _id: pendingOrder._id },
        paymentUrl: khaltiData.payment_url, // Khalti provides a full URL with pidx
      });
    }

    // For COD, create the real order immediately
    const order = await OrderService.createOrder({
      ...orderData,
      user: decoded.userId,
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('API Error [ORDER_POST]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
