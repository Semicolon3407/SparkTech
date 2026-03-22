import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';
import { requireAdmin } from '@/lib/auth/middleware';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req);
    if (error) return error;

    const { id } = await params;
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('API Error [ADMIN_ORDER_GET]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching order'
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin(req);
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updatedOrder = await OrderService.updateOrderStatus(id, status, note);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error: any) {
    console.error('API Error [ADMIN_ORDER_PATCH]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error updating order status'
    }, { status: 500 });
  }
}
