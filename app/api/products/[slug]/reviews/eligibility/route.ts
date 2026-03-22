import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/order';
import Review from '@/lib/db/models/review';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productId } = await params;
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ eligible: false, reason: 'unauthorized' });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ eligible: false, reason: 'unauthorized' });
    }

    await connectDB();

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: decoded.userId,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json({ eligible: false, reason: 'already_reviewed' });
    }

    // Eligibility Check: User must have a 'delivered' order with this product
    const eligibleOrder = await Order.findOne({
      user: decoded.userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (!eligibleOrder) {
      return NextResponse.json({ 
        eligible: false, 
        reason: 'no_delivered_order' 
      });
    }

    return NextResponse.json({ eligible: true });
  } catch (error) {
    return NextResponse.json({ eligible: false, reason: 'error' }, { status: 500 });
  }
}
