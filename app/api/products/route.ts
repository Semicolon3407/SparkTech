import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const isFeatured = searchParams.get("isFeatured");
    const limit = parseInt(searchParams.get("limit") || "20");

    await connectDB();
    
    let query: any = { isActive: true };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isFeatured === "true") query.isFeatured = true;

    const products = await Product.find(query)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
