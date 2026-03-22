import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';
import { requireAdmin } from '@/lib/auth/middleware';

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin(req);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await OrderService.getAllOrders(page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error [ADMIN_ORDERS_GET]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching all orders'
    }, { status: 500 });
  }
}
