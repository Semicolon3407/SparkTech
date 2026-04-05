import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification {
  user?: mongoose.Types.ObjectId; // Optional - if targeted to a specific user (admin)
  title: string;
  message: string;
  type: 'order' | 'stock' | 'user' | 'system';
  isRead: boolean;
  link?: string; // Optional - e.g. /admin/orders/[id]
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'stock', 'user', 'system'],
      default: 'order',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ user: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
