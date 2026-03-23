import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/order';
import WishlistItem from '@/lib/db/models/wishlist';
import Review from '@/lib/db/models/review';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const [orderCount, wishlistCount, reviewCount] = await Promise.all([
       Order.countDocuments({ user: decoded.userId }),
       WishlistItem.countDocuments({ user: decoded.userId }),
       Review.countDocuments({ user: decoded.userId })
    ]);

    return NextResponse.json({ 
       success: true, 
       data: { 
          orderCount, 
          wishlistCount, 
          reviewCount 
       } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
