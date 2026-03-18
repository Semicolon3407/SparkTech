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
  freeThreshold: 5000,
  standardCost: 150,
  expressCost: 300,
};

export const TAX_RATE = 0.13;

export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export const CATEGORIES = [
  {
    name: 'Apple',
    slug: 'apple',
    icon: Apple,
    hasDropdown: true,
    items: [

      {
        title: 'iPhone',
        links: [
          { label: 'iPhone 17 Pro', href: '/category/mobile-phones?brand=Apple' },
          { label: 'iPhone 16 Series', href: '/category/mobile-phones?brand=Apple' },
          { label: 'iPhone 15 | 14 | 13', href: '/category/mobile-phones?brand=Apple' },
          { label: 'iPhone Accessories', href: '/category/accessories?search=iphone' },
          { label: 'Open Box Phones', href: '/category/mobile-phones?condition=open-box' },
        ]
      },
      {
        title: 'Mac',
        links: [
          { label: 'MacBook Air', href: '/category/laptops?brand=Apple' },
          { label: 'MacBook Pro', href: '/category/laptops?brand=Apple' },
          { label: 'iMac', href: '/category/laptops?brand=Apple' },
          { label: 'Mac Mini', href: '/category/laptops?brand=Apple' },
          { label: 'Mac Accessories', href: '/category/accessories?search=mac' },
        ]
      },
      {
        title: 'iPad',
        links: [
          { label: 'iPad Air', href: '/category/tablets?brand=Apple' },
          { label: 'iPad Pro', href: '/category/tablets?brand=Apple' },
          { label: 'iPad Mini', href: '/category/tablets?brand=Apple' },
          { label: 'Apple Pencil', href: '/category/accessories' },
        ]
      },
      {
        title: 'Apple Watch',
        links: [
          { label: 'Apple Watch Series', href: '/category/lifestyle?search=watch' },
          { label: 'Apple Watch Ultra', href: '/category/lifestyle?search=watch' },
          { label: 'Apple Watch SE', href: '/category/lifestyle?search=watch' },
        ]
      },
      {
        title: 'Apple Audio',
        links: [
          { label: 'AirPods', href: '/category/audio?brand=Apple' },
          { label: 'AirPods Max', href: '/category/audio?brand=Apple' },
          { label: 'Beats EarBuds', href: '/category/audio?brand=Beats' },
        ]
      },
      {
        title: 'Accessories',
        links: [
          { label: 'Apple Adapters', href: '/category/accessories?brand=Apple' },
          { label: 'Apple Cables', href: '/category/accessories?brand=Apple' },
          { label: 'Airtag', href: '/category/accessories?brand=Apple' },
        ]
      }

    ]
  },
  { name: 'Android', slug: 'android', hasDropdown: true },
  { name: 'Video / Photography', slug: 'video-photography', hasDropdown: true },
  { name: 'Audio', slug: 'audio', hasDropdown: true },
  { name: 'Home Theatre', slug: 'home-theatre', hasDropdown: true },
  { name: 'Lifestyle', slug: 'lifestyle', hasDropdown: true },
  { name: 'Accessories', slug: 'accessories', hasDropdown: true },
  { name: 'EV', slug: 'ev', hasDropdown: true },
  { name: 'Brands', slug: 'brands' },
  { name: 'On Sale', slug: 'on-sale', highlight: true },
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
  { label: 'Categories', href: '/admin/categories', icon: 'Folder' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;
