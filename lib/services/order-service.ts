import Order from '@/lib/db/models/order';
import Product from '@/lib/db/models/product';
import User from '@/lib/db/models/user';
import connectDB from '@/lib/db/mongodb';
import { Order as OrderType, PaginatedResponse } from '@/types';
import { NotificationService } from './notification-service';
import { sendEmail } from '@/lib/mail/nodemailer';
import { getOrderEmailHtml } from '@/lib/mail/order-email-template';
import { generateInvoiceBuffer } from '@/lib/mail/invoice-pdf-generator';

export const OrderService = {
  async createOrder(orderData: any): Promise<any> {
    try {
      await connectDB();
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Prepare initial status history
      const initialStatusHistory = orderData.statusHistory || [
        {
          status: 'pending',
          date: new Date(),
          note: 'Order placed successfully'
        }
      ];

      // If the order is created with 'confirmed' status (e.g. after successful payment),
      // add the confirmation step to history if it's not already there.
      if (orderData.orderStatus === 'confirmed' && !initialStatusHistory.some((h: any) => h.status === 'confirmed')) {
        initialStatusHistory.push({
          status: 'confirmed',
          date: new Date(),
          note: orderData.paymentMethod === 'cod' 
            ? 'Order confirmed' 
            : `Payment confirmed via ${orderData.paymentMethod?.toUpperCase() || 'Online Payment'}`
        });
      }

      const newOrder = new Order({
        ...orderData,
        orderNumber,
        orderStatus: orderData.orderStatus || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        statusHistory: initialStatusHistory
      });

      const savedOrder = await newOrder.save();
      
      // Create notification for admin
      await NotificationService.createNotification({
        title: 'New Order Received',
        message: `Order #${orderNumber} for Rs. ${orderData.total.toLocaleString()} was placed.`,
        type: 'order',
        link: `/admin/orders`
      });

      // Update stock for each item
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // Send Order Confirmation Email to User
      try {
        const userData = await User.findById(savedOrder.user);
        if (userData && userData.email) {
          const emailHtml = getOrderEmailHtml(savedOrder);
          const pdfBuffer = await generateInvoiceBuffer(savedOrder);

          await sendEmail(
            userData.email,
            `Order Confirmation - ${orderNumber}`,
            emailHtml,
            [
              {
                filename: `Invoice_${orderNumber}.pdf`,
                content: pdfBuffer,
              }
            ]
          );
          console.log(`Order confirmation email sent to ${userData.email}`);
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't throw, we don't want to fail the order if email fails
      }

      return JSON.parse(JSON.stringify(savedOrder));
    } catch (error: any) {
      console.error('Error creating order - Details:', {
        message: error.message,
        errors: error.errors, // For Mongoose validation details
        payload: orderData
      });
      throw error;
    }

  },

  async getUserOrders(userId: string): Promise<OrderType[]> {
    try {
      await connectDB();
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
      return JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  async getOrderById(orderId: string): Promise<OrderType | null> {
    try {
      await connectDB();
      const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .lean();
      return order ? JSON.parse(JSON.stringify(order)) : null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  },

  async getAllOrders(page = 1, limit = 10): Promise<PaginatedResponse<OrderType>> {
    try {
      await connectDB();
      const skip = (page - 1) * limit;
      
      const [data, total] = await Promise.all([
        Order.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: JSON.parse(JSON.stringify(data)),
        pagination: { page, limit, total, totalPages }
      };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<any> {
    try {
      await connectDB();
      
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Order not found');

      // If cancelling, restore stock
      if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
          });
        }
      }

      order.orderStatus = status as any;
      order.statusHistory.push({
        status: status as any,
        date: new Date(),
        note: note || `Order status updated to ${status}`
      });

      if (status === 'delivered') {
        order.paymentStatus = 'paid';
      }

      const updatedOrder = await order.save();
      return JSON.parse(JSON.stringify(updatedOrder));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};
