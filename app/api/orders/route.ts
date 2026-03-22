import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const orderData = {
      ...body,
      user: user.userId,
    };

    const newOrder = await OrderService.createOrder(orderData);
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error: any) {
    console.error('API Error [ORDERS_POST]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error creating order'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await OrderService.getUserOrders(user.userId);

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('API Error [ORDERS_GET]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching user orders'
    }, { status: 500 });
  }
}
