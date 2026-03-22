import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Security check: Order must belong to the user
    const orderUserId = typeof order.user === 'object' ? (order.user as any)._id : String(order.user);

    if (orderUserId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('API Error [USER_ORDER_GET]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching order'
    }, { status: 500 });
  }
}
