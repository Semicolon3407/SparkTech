import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PendingOrder from "@/lib/db/models/pending-order";
import Cart from "@/lib/db/models/cart";
import { OrderService } from "@/lib/services/order-service";

// Khalti Sandbox credentials
const KHALTI_CONFIG = {
  SECRET_KEY: '05bf95cc57244045b8df5fad06748dab', // Sample sandbox key
  BASE_URL: 'https://dev.khalti.com/api/v2',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get('pidx');
    const status = searchParams.get('status');
    const purchaseOrderId = searchParams.get('purchase_order_id');

    if (!pidx || status !== 'Completed') {
      console.warn('Khalti Payment failed or cancelled:', status);
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // Verify payment using Lookup API (Mandatory for security)
    const verifyResponse = await fetch(`${KHALTI_CONFIG.BASE_URL}/epayment/lookup/`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_CONFIG.SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || verifyData.status !== 'Completed') {
      console.error('Khalti Verification Mismatch:', verifyData);
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    await connectDB();
    
    // purchaseOrderId corresponds to PendingOrder ID
    const pendingOrder = await PendingOrder.findById(purchaseOrderId);

    if (!pendingOrder) {
      console.error('Pending order not found for Khalti callback:', purchaseOrderId);
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // Finalize order
    const order = await OrderService.createOrder({
      ...pendingOrder.orderData,
      paymentStatus: 'paid',
      paymentDetails: {
        transactionId: verifyData.transaction_id || pidx,
        gateway: 'khalti',
        paidAt: new Date(),
      },
      orderStatus: 'confirmed',
    });

    // CLEAR the user's cart now that the transaction is successful
    await Cart.findOneAndUpdate(
      { user: pendingOrder.user },
      { $set: { items: [] } }
    );

    // Cleanup session
    await PendingOrder.findByIdAndDelete(purchaseOrderId);

    // Redirect to confirmation
    return NextResponse.redirect(new URL(`/orders/${order._id}/confirmation`, req.url));
  } catch (error) {
    console.error('Khalti Callback Critical Error:', error);
    return NextResponse.redirect(new URL("/cart", req.url));
  }
}
