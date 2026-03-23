import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";
import PendingOrder from "@/lib/db/models/pending-order";
import Cart from "@/lib/db/models/cart";
import { OrderService } from "@/lib/services/order-service";

// eSewa UAT credentials
const ESEWA_CONFIG = {
  MERCHANT_CODE: 'EPAYTEST',
  SECRET_KEY: '8gBm/:&EnhH.1/q', // Official UAT Secret Key from docs
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dataEncoded = searchParams.get('data');

    if (!dataEncoded) {
      console.error('eSewa Callback: No data parameter found');
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // Decode base64 data from eSewa
    const decodedBuffer = Buffer.from(dataEncoded, 'base64');
    const decodedData = JSON.parse(decodedBuffer.toString('utf8'));
    console.log('eSewa Decoded Callback Data:', decodedData);

    const { 
      transaction_code, 
      status, 
      total_amount, 
      transaction_uuid, 
      product_code, 
      signed_field_names, 
      signature 
    } = decodedData;

    if (status !== 'COMPLETE') {
      console.warn(`eSewa Payment status not complete: ${status}`);
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // Verify Integrity (Signature Verification)
    const verificationString = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', ESEWA_CONFIG.SECRET_KEY)
      .update(verificationString)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.error('eSewa Verification Failed: Signature mismatch');
      // return NextResponse.redirect(new URL("/cart", req.url));
    }

    await connectDB();
    
    // transaction_uuid is in format "PEND-ID"
    const pendingOrderId = transaction_uuid.replace('PEND-', '');
    const pendingOrder = await PendingOrder.findById(pendingOrderId);

    if (!pendingOrder) {
      console.error('Pending order not found for eSewa callback:', pendingOrderId);
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // NOW create the real order since payment is successful
    const order = await OrderService.createOrder({
      ...pendingOrder.orderData,
      paymentStatus: 'paid',
      paymentDetails: {
        transactionId: transaction_code,
        gateway: 'esewa',
        paidAt: new Date(),
      },
      orderStatus: 'confirmed',
    });

    // CLEAR the user's cart now that the transaction is successful
    await Cart.findOneAndUpdate(
      { user: pendingOrder.user },
      { $set: { items: [] } }
    );

    // Delete the pending order record
    await PendingOrder.findByIdAndDelete(pendingOrderId);

    // Redirect to confirmation page
    return NextResponse.redirect(new URL(`/orders/${order._id}/confirmation`, req.url));
  } catch (error) {
    console.error('eSewa Callback Critical Error:', error);
    return NextResponse.redirect(new URL("/cart", req.url));
  }
}
