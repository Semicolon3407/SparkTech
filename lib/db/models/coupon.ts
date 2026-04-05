import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  user: mongoose.Types.ObjectId;
  discountPercent: number;
  isUsed: boolean;
  usedAt?: Date;
  expiresAt: Date;
  awardedForOrderCount: number;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    discountPercent: { type: Number, required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
    expiresAt: { type: Date, required: true },
    awardedForOrderCount: { type: Number, required: true },
  },
  { timestamps: true }
);

CouponSchema.index({ user: 1 });
CouponSchema.index({ code: 1 });

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
