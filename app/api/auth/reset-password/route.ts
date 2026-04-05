import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { hashPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email, OTP and new password are required' }, { status: 400 });
    }

    // Hash OTP from request to compare with stored hash
    const resetPasswordOTP = crypto.createHash('sha256').update(otp).digest('hex');

    await connectDB();

    // Find user with valid OTP and not expired
    const user = await User.findOne({ 
      email,
      resetPasswordOTP, 
      resetPasswordExpires: { $gt: new Date() } 
    }).select('+password');

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset OTP' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password and clear OTP
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
