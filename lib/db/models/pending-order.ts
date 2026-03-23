import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPendingOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderData: any;
  createdAt: Date;
}

const PendingOrderSchema = new Schema<IPendingOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Auto-delete after 1 hour if not completed
    },
  }
);

const PendingOrder: Model<IPendingOrder> = 
  mongoose.models.PendingOrder || mongoose.model<IPendingOrder>('PendingOrder', PendingOrderSchema);

export default PendingOrder;
