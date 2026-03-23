import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ success: false, error: "Invalid product IDs" }, { status: 400 });
    }

    await connectDB();
    const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
    
    // Sort products by the order of IDs passed
    const productsMap = new Map(products.map(p => [(p._id as any).toString(), p]));
    const sortedProducts = ids.map(id => productsMap.get(id)).filter(Boolean);

    return NextResponse.json({ success: true, data: sortedProducts });
  } catch (error: any) {
    console.error("Batch product fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
