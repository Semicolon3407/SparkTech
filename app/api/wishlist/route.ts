import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import WishlistItem from '@/lib/db/models/wishlist';
import Product from '@/lib/db/models/product';
import { verifyToken } from '@/lib/auth/jwt';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const items = await WishlistItem.find({ user: decoded.userId })
      .populate('product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: items });
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

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    await connectDB();
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    // Find or create
    const item = await WishlistItem.findOneAndUpdate(
      { user: decoded.userId, product: productId },
      { user: decoded.userId, product: productId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    if (!productId) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    await connectDB();
    await WishlistItem.findOneAndDelete({ user: decoded.userId, product: productId });

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
