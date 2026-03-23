import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth/jwt';

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, email, phone } = await req.json();

    await connectDB();
    
    // Check if email taken by another user
    if (email) {
       const existingUser = await User.findOne({ email, _id: { $ne: decoded.userId } });
       if (existingUser) {
          return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
       }
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { name, email, phone } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
