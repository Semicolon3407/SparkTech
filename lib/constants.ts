import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Camera,
  Watch,
  Speaker,
  Zap,
  Tag,
  Monitor,
  Airplay,
  MousePointer2,
  Keyboard,
  Apple,
} from 'lucide-react';

export const APP_NAME = 'SparkTech';
export const APP_DESCRIPTION = 'Your one-stop shop for premium electronics - Mobile, Laptop, Audio & Accessories';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const CURRENCY = {
  code: 'NPR',
  symbol: 'Rs.',
  locale: 'en-NP',
};

export const SHIPPING = {
  freeThreshold: 20,
  standardCost: 10,
  expressCost: 10,
};

export const TAX_RATE = 0.13;

export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;


export const CATEGORIES = [
  {
    name: 'Mobile',
    slug: 'Mobile',
    icon: Smartphone,
  },
  {
    name: 'Laptop',
    slug: 'Laptop',
    icon: Laptop,
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    icon: Zap,
  },
  {
    name: 'Earphone',
    slug: 'Earphone',
    icon: Headphones,
  },
  {
    name: 'Headphone',
    slug: 'Headphone',
    icon: Headphones,
  },
  {
    name: 'Speakers',
    slug: 'Speakers',
    icon: Speaker,
  },
  {
    name: 'On Sale',
    slug: 'on-sale',
    highlight: true
  },
] as const;

export const BRANDS = {
  mobile: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Realme', 'Oppo', 'Vivo'],
  laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'],
  audio: ['Apple', 'Samsung', 'Sony', 'JBL', 'Bose', 'Boat', 'Realme'],
} as const;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmed', color: 'blue' },
  { value: 'processing', label: 'Processing', color: 'purple' },
  { value: 'shipped', label: 'Shipped', color: 'indigo' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'refunded', label: 'Refunded', color: 'gray' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'esewa', label: 'eSewa', icon: '/images/payments/esewa.png' },
  { value: 'khalti', label: 'Khalti', icon: '/images/payments/khalti.png' },
  { value: 'cod', label: 'Cash on Delivery', icon: null },
] as const;

export const NEPAL_STATES = [
  'Province 1',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;
