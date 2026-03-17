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
    items: [
      {
        title: 'iPhone',
        links: [
          { label: 'iPhone 17', href: '/products/iphone-17' },
          { label: 'iPhone Air', href: '/products/iphone-air' },
          { label: 'iPhone 17 Pro | 17 Pro Max', href: '/products/iphone-17-pro' },
          { label: 'iPhone 16e | 16 | 16 Plus', href: '/products/iphone-16' },
          { label: 'iPhone 15 | 14 | 13', href: '/products/iphone-old' },
          { label: 'iPhone Accessories', href: '/category/iphone-accessories' },
          { label: 'Open Box Phones', href: '/category/open-box' },
        ]
      },
      {
        title: 'Mac',
        links: [
          { label: 'Macbook', href: '/category/macbook' },
          { label: 'Macbook Air', href: '/category/macbook-air' },
          { label: 'MacBook Pro', href: '/category/macbook-pro' },
          { label: 'iMac', href: '/category/imac' },
          { label: 'Mac Mini', href: '/category/mac-mini' },
          { label: 'Mac Pro / Mac Studio', href: '/category/mac-pro' },
          { label: 'Macbook Accessories', href: '/category/macbook-accessories' },
        ]
      },
      {
        title: 'iPad',
        links: [
          { label: 'iPad', href: '/category/ipad' },
          { label: 'iPad Air', href: '/category/ipad-air' },
          { label: 'iPad Pro', href: '/category/ipad-pro' },
          { label: 'iPad Mini', href: '/category/ipad-mini' },
          { label: 'Apple Pencil', href: '/category/apple-pencil' },
          { label: 'iPad Accessories', href: '/category/ipad-accessories' },
        ]
      },
      {
        title: 'Apple Watch',
        links: [
          { label: 'Apple Watch', href: '/category/apple-watch' },
          { label: 'Apple Watch Ultra Series', href: '/category/apple-watch-ultra' },
          { label: 'Apple Watch SE', href: '/category/apple-watch-se' },
          { label: 'Apple Watch Accessories', href: '/category/apple-watch-accessories' },
        ]
      },
      {
        title: 'Apple Audio',
        links: [
          { label: 'AirPods', href: '/category/airpods' },
          { label: 'Earphone', href: '/category/earphone' },
          { label: 'Beats EarBuds', href: '/category/beats' },
          { label: 'Airpods Accessories', href: '/category/airpods-accessories' },
        ]
      },
      {
        title: 'Apple Accessories',
        links: [
          { label: 'Apple Adapters', href: '/category/apple-adapters' },
          { label: 'Apple Cables', href: '/category/apple-cables' },
          { label: 'Apple Keyboard | Mouse | Trackpad', href: '/category/apple-peripherals' },
          { label: 'Apple AirTag', href: '/category/apple-airtag' },
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
