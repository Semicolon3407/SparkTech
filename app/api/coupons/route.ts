import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import { CouponService } from '@/lib/services/coupon-service';
import User from '@/lib/db/models/user';

// GET /api/coupons - Get user's coupons
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    // Auto-check and award before returning coupons
    // This catches users who hit milestones before the system was added
    const user = await User.findById(decoded.userId);
    if (user) {
      await CouponService.checkAndAwardCoupon(decoded.userId, user.email, user.name || 'Customer');
    }

    const coupons = await CouponService.getUserCoupons(decoded.userId);

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(coupons)) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
