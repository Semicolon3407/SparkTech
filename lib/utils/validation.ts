import { z } from 'zod';

// User Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Address Schema
export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  isDefault: z.boolean().default(false),
});

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  comparePrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  features: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

// Cart Schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Order Schema
export const orderSchema = z.object({
  items: z.array(z.object({
    product: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string(),
  })).min(1, 'Order must have at least one item'),
  shippingAddress: addressSchema.omit({ label: true, isDefault: true }),
  paymentMethod: z.enum(['esewa', 'khalti', 'cod']),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  note: z.string().optional(),
});

// Review Schema
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(2, 'Title is required'),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
