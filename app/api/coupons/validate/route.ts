import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import { CouponService } from '@/lib/services/coupon-service';

// POST /api/coupons/validate - Validate or mark a coupon as used
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { code, markUsed } = await req.json();
    if (!code) return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });

    await connectDB();

    // If markUsed flag is set, just mark the coupon as used
    if (markUsed) {
      await CouponService.markCouponUsed(code, decoded.userId);
      return NextResponse.json({ success: true });
    }

    const result = await CouponService.validateCoupon(code, decoded.userId);

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discountPercent: (result.coupon as any).discountPercent,
      code: (result.coupon as any).code,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
