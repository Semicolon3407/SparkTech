import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { sendEmail } from '@/lib/mail/nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Please provide an email' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal user existence
      return NextResponse.json({ success: true, message: 'If an account exists with that email, a reset link has been sent' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const resetPasswordOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 600000); // 10 minutes

    // Save OTP to user
    user.resetPasswordOTP = resetPasswordOTP;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Email template
    const message = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; padding: 20px; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">SparkTech Reset OTP</h2>
        <p>Your 4-digit verification code for password reset is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; background: #f0f7ff; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">SparkTech - Electronics Store</p>
      </div>
    `;

    await sendEmail(user.email, 'Password Reset OTP - SparkTech', message);

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
