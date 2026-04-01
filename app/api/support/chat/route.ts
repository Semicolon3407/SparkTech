import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Message from '@/lib/db/models/message';
import User from '@/lib/db/models/user';
import { getCurrentUser } from '@/lib/auth/jwt';
import mongoose from 'mongoose';

// GET all messages (for Current User or a Conversation for Admin)
export async function GET(req: Request) {
  try {
    const userPayload = await getCurrentUser();
    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId'); // For admin to view specific user chat
    
    await connectDB();

    let query: any = {};
    
    if (userPayload.role === 'admin' || userPayload.role === 'superadmin') {
      if (targetUserId) {
        // Admin viewing specific user messages - show ALL messages for this user
        query = {
          $or: [
            { sender: targetUserId },
            { receiver: targetUserId },
          ]
        };
      } else {
        // Admin listing all unique conversations (last message per user pair)
        const conversations = await Message.aggregate([
          {
            $sort: { createdAt: -1 }
          },
          {
            $group: {
              _id: { $cond: [{ $eq: ["$role", "admin"] }, "$receiver", "$sender"] },
              lastMessage: { $first: "$$ROOT" },
              unreadCount: { 
                $sum: { $cond: [{ $and: [{ $eq: ["$isRead", false] }, { $ne: ["$sender", new mongoose.Types.ObjectId(userPayload.userId)] }] }, 1, 0] }
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'customer'
            }
          },
          { $unwind: '$customer' },
          { $sort: { 'lastMessage.createdAt': -1 } }
        ]);
        return NextResponse.json({ success: true, data: conversations });
      }
    } else {
      // User viewing their own support messages
      query = {
        $or: [
          { sender: userPayload.userId },
          { receiver: userPayload.userId }
        ]
      };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role');

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new message
export async function POST(req: Request) {
  try {
    const userPayload = await getCurrentUser();
    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, receiverId, orderId } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    await connectDB();

    let targetReceiverId = receiverId;

    if (!targetReceiverId) {
      // If user is sending without receiverId, find a Super Admin
      const superAdmin = await User.findOne({ role: 'superadmin' });
      const admin = await User.findOne({ role: 'admin' });
      targetReceiverId = superAdmin?._id || admin?._id;
      
      if (!targetReceiverId) {
        return NextResponse.json({ success: false, error: 'No support agent available' }, { status: 503 });
      }
    }

    const newMessage = await Message.create({
      sender: userPayload.userId,
      receiver: targetReceiverId,
      content,
      orderId: orderId ? (mongoose.Types.ObjectId.isValid(orderId) ? new mongoose.Types.ObjectId(orderId) : undefined) : undefined,
      role: (userPayload.role === 'admin' || userPayload.role === 'superadmin') ? 'admin' : 'user',
      isRead: false
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role');

    return NextResponse.json({ success: true, data: populatedMessage });
  } catch (error: any) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH to mark messages as read
export async function PATCH(req: Request) {
  try {
    const userPayload = await getCurrentUser();
    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');

    if (!senderId) {
      return NextResponse.json({ success: false, error: 'Sender ID required' }, { status: 400 });
    }

    await connectDB();
    await Message.updateMany(
      { sender: senderId, receiver: userPayload.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
