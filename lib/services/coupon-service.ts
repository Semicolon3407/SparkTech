import mongoose from 'mongoose';
import Coupon from '@/lib/db/models/coupon';
import Order from '@/lib/db/models/order';
import connectDB from '@/lib/db/mongodb';
import { sendEmail } from '@/lib/mail/nodemailer';

const generateCouponCode = (prefix: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix + '-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const CouponService = {

  /**
   * Called after every order. Checks total items purchased (sum of all quantities
   * across all non-cancelled orders). Awards coupons at 5 and 10 item milestones.
   * Works whether the user buys 1 item at a time, 5 in one go, same or different days.
   */
  async checkAndAwardCoupon(userId: string, userEmail: string, userName: string): Promise<void> {
    try {
      await connectDB();

      // Sum ALL item quantities across all non-cancelled orders
      const result = await Order.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            orderStatus: { $ne: 'cancelled' },
          },
        },
        {
          $unwind: '$items',
        },
        {
          $group: {
            _id: null,
            totalItems: { $sum: '$items.quantity' },
          },
        },
      ]);

      const totalItemsPurchased: number = result.length > 0 ? result[0].totalItems : 0;
      console.log(`User ${userId} has purchased ${totalItemsPurchased} total items`);

      // Reward logic:
      // Every 5th item (5, 15, 25...) awards a 10% discount.
      // Every 10th item (10, 20, 30...) awards a 20% discount.
      for (let count = 5; count <= totalItemsPurchased; count += 5) {
        const discountAmount = (count % 10 === 0) ? 20 : 10;

        // Check if a coupon for this specific milestone count was already given
        const existing = await Coupon.findOne({
          user: userId,
          awardedForOrderCount: count,
        });

        if (!existing) {
          const code = generateCouponCode(`SPARK${discountAmount}`);
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

          await Coupon.create({
            code,
            user: userId,
            discountPercent: discountAmount,
            isUsed: false,
            expiresAt,
            awardedForOrderCount: count,
          });

          // Send coupon email
          await CouponService.sendCouponEmail(userEmail, userName, code, discountAmount, expiresAt, count);
          console.log(`Coupon ${code} (${discountAmount}% off) awarded to user ${userId} for reaching ${count} total items`);
        }
      }
    } catch (err) {
      console.error('CouponService.checkAndAwardCoupon error:', err);
    }
  },

  async sendCouponEmail(email: string, name: string, code: string, discount: number, expiresAt: Date, itemCount: number) {
    const formatted = expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4361EE, #7209b7); padding: 30px; text-align: center; color: white;">
          <h1 style="margin:0; font-size: 28px;">SPARK TECH</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">🎉 You've Earned a Reward!</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 18px;">Hi ${name},</p>
          <p>Thank you for being a loyal SparkTech customer! You've purchased <strong>${itemCount}+ items</strong> from us — as a reward, here's an exclusive <strong>${discount}% discount coupon</strong> for your next purchase!</p>
          <div style="background: #f0f4ff; border: 2px dashed #4361EE; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">YOUR COUPON CODE</p>
            <div style="font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #4361EE;">${code}</div>
            <p style="margin: 8px 0 0; color: #64748b; font-size: 12px;">Expires: ${formatted}</p>
          </div>
          <p>Enter this code at checkout to enjoy <strong>${discount}% off</strong> your next order.</p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
          SparkTech Digital Evolution – Kathmandu, Nepal
        </div>
      </div>
    `;
    await sendEmail(email, `🎉 Your ${discount}% Discount Coupon - SparkTech`, html);
  },

  async getUserCoupons(userId: string) {
    await connectDB();
    return Coupon.find({ user: userId }).sort({ createdAt: -1 }).lean();
  },

  async validateCoupon(code: string, userId: string) {
    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), user: userId });

    if (!coupon) return { valid: false, error: 'Coupon not found or does not belong to you' };
    if (coupon.isUsed) return { valid: false, error: 'Coupon has already been used' };
    if (new Date() > coupon.expiresAt) return { valid: false, error: 'Coupon has expired' };

    return { valid: true, coupon };
  },

  async markCouponUsed(code: string, userId: string) {
    await connectDB();
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase(), user: userId },
      { isUsed: true, usedAt: new Date() }
    );
  },
};
