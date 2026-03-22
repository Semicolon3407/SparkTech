import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { requireAdmin } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/password';

/**
 * GET: Fetch all users
 */
export async function GET(req: Request) {
  const { user: authUser, error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create a new user
 */
export async function POST(req: Request) {
  const { user: authUser, error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { name, email, password, role, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
