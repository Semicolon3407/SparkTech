import Notification from '@/lib/db/models/notification';
import connectDB from '@/lib/db/mongodb';

export const NotificationService = {
  async createNotification(data: any): Promise<any> {
    try {
      await connectDB();
      const notification = new Notification(data);
      const savedNotification = await notification.save();
      return JSON.parse(JSON.stringify(savedNotification));
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getAdminNotifications(limit = 10): Promise<any[]> {
    try {
      await connectDB();
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<any> {
    try {
      await connectDB();
      const updated = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
      return JSON.parse(JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      await connectDB();
      return await Notification.countDocuments({ isRead: false });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  async markAllAsRead(): Promise<any> {
    try {
      await connectDB();
      return await Notification.updateMany({ isRead: false }, { isRead: true });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};
