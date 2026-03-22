import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Review from '@/lib/db/models/review';
import Order from '@/lib/db/models/order';
import Product from '@/lib/db/models/product';
import { verifyToken } from '@/lib/auth/jwt';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const reviews = await Review.find({ product: slug })
      .populate('user', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productId } = await params;
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { rating, title, comment } = await req.json();

    if (!rating || !title || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Eligibility Check: User must have a 'delivered' order with this product
    const eligibleOrder = await Order.findOne({
      user: decoded.userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (!eligibleOrder) {
      return NextResponse.json({ 
        error: 'You can only review products that have been delivered to you.' 
      }, { status: 403 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: decoded.userId,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: decoded.userId,
      rating,
      title,
      comment,
      isVerified: true // Since we checked they ordered it
    });

    // Update Product average rating and count
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
