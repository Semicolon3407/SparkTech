import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { comparePassword } from '@/lib/auth/password';
import { createToken, setAuthCookie } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = await createToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return NextResponse.json(
      { success: true, data: { user: userResponse } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
