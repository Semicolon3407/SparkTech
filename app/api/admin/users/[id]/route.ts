import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { requireAdmin } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/password';

/**
 * PATCH: Update a user
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { user: authUser, error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role, phone, password } = body;

    await connectDB();
    const existing = await User.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Role-based security logic:
    // Only superadmin can change roles or edit other superadmins
    if (existing.role === 'superadmin' && authUser!.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (body.role && body.role !== existing.role && authUser!.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Only SuperAdmin can change roles' }, { status: 403 });
    }

    if (name) existing.name = name;
    if (email) existing.email = email;
    if (role && authUser!.role === 'superadmin') existing.role = role;
    if (phone !== undefined) existing.phone = phone;

    if (password) {
      existing.password = await hashPassword(password);
    }

    await existing.save();

    return NextResponse.json({ success: true, data: existing });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a user
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { user: authUser, error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { id } = await params;

    await connectDB();
    const existing = await User.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Role security logic:
    if (existing.role === 'superadmin') {
      return NextResponse.json({ success: false, error: 'SuperAdmin cannot be deleted via API' }, { status: 403 });
    }

    // Admins cannot delete other admins/superadmins (only superadmin can)
    if (existing.role === 'admin' && authUser!.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
