import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Cart from '@/lib/db/models/cart';
import Product from '@/lib/db/models/product';
import { verifyToken } from '@/lib/auth/jwt';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ user: decoded.userId }).populate('items.product');

    return NextResponse.json({ success: true, data: cart ? cart.items : [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== 'number') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });

    await connectDB();
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    // Find or create cart
    let cart = await Cart.findOne({ user: decoded.userId });
    if (!cart) {
      cart = await Cart.create({ user: decoded.userId, items: [] });
    }

    // Check if item in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    return NextResponse.json({ success: true, data: populatedCart ? populatedCart.items : [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    if (productId) {
      // Remove specific item
      await Cart.findOneAndUpdate(
        { user: decoded.userId },
        { $pull: { items: { product: productId } } }
      );
    } else {
      // Clear all
      await Cart.findOneAndUpdate(
        { user: decoded.userId },
        { $set: { items: [] } }
      );
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Special bulk sync for login
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { items: localItems } = await req.json();
    if (!Array.isArray(localItems)) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });

    await connectDB();
    
    // Find or create cart
    let cart = await Cart.findOne({ user: decoded.userId });
    if (!cart) {
      cart = await Cart.create({ user: decoded.userId, items: [] });
    }

    // Merge logic: For each local item, find existing or add
    for (const localItem of localItems) {
      const productId = typeof localItem.product === 'string' ? localItem.product : localItem.product._id;
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = Math.max(cart.items[itemIndex].quantity, localItem.quantity);
      } else {
        cart.items.push({ product: productId, quantity: localItem.quantity });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    return NextResponse.json({ success: true, data: populatedCart ? populatedCart.items : [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
