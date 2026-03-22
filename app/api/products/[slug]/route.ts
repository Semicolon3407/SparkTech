import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true }).lean();
    
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
