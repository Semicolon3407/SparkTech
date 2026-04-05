import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/services/notification-service';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await NotificationService.getAdminNotifications();
    const unreadCount = await NotificationService.getUnreadCount();

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error: any) {
    console.error('API Error [NOTIFICATIONS_GET]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await NotificationService.markAllAsRead();
    } else if (notificationId) {
      await NotificationService.markAsRead(notificationId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error [NOTIFICATIONS_PATCH]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
