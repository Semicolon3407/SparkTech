import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/order';
import { verifyToken } from '@/lib/auth/jwt';

// GET /api/coupons/progress - Returns total items purchased by user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const result = await Order.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(decoded.userId),
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalItems: { $sum: '$items.quantity' },
        },
      },
    ]);

    const totalItems = result.length > 0 ? result[0].totalItems : 0;

    return NextResponse.json({ success: true, totalItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
