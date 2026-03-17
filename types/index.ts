// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: Category | string;
  subcategory?: string;
  brand: string;
  images: string[];
  stock: number;
  sku: string;
  specifications: Specification[];
  features: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specification {
  key: string;
  value: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  isActive: boolean;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'esewa' | 'khalti' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: PaymentDetails;
  orderStatus: OrderStatus;
  statusHistory: StatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentDetails {
  transactionId: string;
  gateway: string;
  paidAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface StatusHistory {
  status: OrderStatus;
  date: Date;
  note?: string;
}

// Review Types
export interface Review {
  _id: string;
  product: string;
  user: User | string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
}

// Wishlist Types
export interface WishlistItem {
  _id: string;
  user: string;
  product: Product | string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByCategory: { category: string; sales: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}
