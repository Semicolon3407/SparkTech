import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { hashPassword } from '@/lib/auth/password';
import { createToken, setAuthCookie } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    // First user is superadmin by default for initial setup, but in real deployment we'd seed it differently.
    // For now, let's keep it simple.
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'superadmin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

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
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
