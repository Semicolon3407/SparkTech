import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * GET: Fetch all products (for admin list)
 */
export async function GET(req: Request) {
  const { error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create product
 */
export async function POST(req: Request) {
  const { error } = await requireAdmin(req as any);
  if (error) return error;

  try {
    const body = await req.json();
    await connectDB();

    // Basic slug generation if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Product with this slug or SKU already exists" }, { status: 400 });
    }
    console.error("Product create error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
