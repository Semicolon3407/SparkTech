import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Message from '@/lib/db/models/message';
import User from '@/lib/db/models/user';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const userPayload = await getCurrentUser();
    if (!userPayload || (userPayload.role !== 'admin' && userPayload.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // 1. Active Customers (Unique users who messaged in the last 24 hours)
    const activeCustomersResult = await Message.distinct('sender', {
      role: 'user',
      createdAt: { $gte: startOfYesterday }
    });
    const activeCustomers = activeCustomersResult.length;

    // 2. Daily Queries (Total user messages today)
    const dailyQueries = await Message.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfToday }
    });

    // 3. New customers right now (messaged in the last 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const newNowResult = await Message.distinct('sender', {
      role: 'user',
      createdAt: { $gte: oneHourAgo }
    });
    const newNow = newNowResult.length;

    // 4. Resolution rate (Percentage of user messages that are read by an admin)
    const totalUserMessages = await Message.countDocuments({ role: 'user' });
    const readUserMessages = await Message.countDocuments({ role: 'user', isRead: true });
    const resolutionRate = totalUserMessages > 0 ? Math.round((readUserMessages / totalUserMessages) * 100) : 100;

    return NextResponse.json({
      success: true,
      data: {
        activeCustomers,
        dailyQueries,
        newNow,
        resolutionRate
      }
    });
  } catch (error: any) {
    console.error('Support stats error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
