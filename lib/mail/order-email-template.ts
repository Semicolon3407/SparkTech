import { formatPrice } from "@/lib/utils/format";
import { format } from "date-fns";

export const getOrderEmailHtml = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.name}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: #4361EE; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">SPARK TECH</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Order Confirmation</p>
      </div>

      <div style="padding: 30px;">
        <h2 style="color: #4361EE; margin-top: 0;">Thank you for your order!</h2>
        <p>Hi ${order.shippingAddress.fullName},</p>
        <p>Your order <strong>${order.orderNumber}</strong> has been placed successfully and is being processed. We'll send you another email when your items ship.</p>

        <!-- Order Summary -->
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 20px 12px 6px; text-align: right; color: #64748b;">Subtotal</td>
              <td style="padding: 20px 12px 6px; text-align: right; font-weight: bold;">${formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 6px 12px; text-align: right; color: #64748b;">Shipping</td>
              <td style="padding: 6px 12px; text-align: right; font-weight: bold;">${order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 6px 12px; text-align: right; color: #64748b;">Tax</td>
              <td style="padding: 6px 12px; text-align: right; font-weight: bold;">${formatPrice(order.tax)}</td>
            </tr>
            <tr style="font-size: 18px;">
              <td colspan="3" style="padding: 20px 12px; text-align: right; font-weight: bold; color: #4361EE;">Final Total</td>
              <td style="padding: 20px 12px; text-align: right; font-weight: 900; color: #4361EE;">${formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Shipping Info -->
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 20px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #334155;">Shipping Address</h3>
          <p style="margin: 5px 0; font-size: 14px; color: #475569;">
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" style="background-color: #4361EE; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.4);">Track Your Order</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 25px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">Spark Tech Digital Evolution</p>
        <p style="margin: 5px 0;">Kathmandu, Nepal</p>
        <p style="margin: 15px 0 0;">If you have any questions, reply to this email or contact <a href="mailto:support@sparktech.com" style="color: #4361EE; text-decoration: none;">support@sparktech.com</a></p>
      </div>
    </div>
  `;
};
