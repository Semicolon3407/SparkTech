import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * GET: Fetch single product by ID (for admin editing)
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Update product
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete product
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
