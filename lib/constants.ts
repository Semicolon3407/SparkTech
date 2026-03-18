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
  { 
    name: 'Android', 
    slug: 'android', 
    hasDropdown: true,
    items: [
      {
        title: 'Popular Brands',
        links: [
          { label: 'Samsung', href: '/category/mobile-phones?brands=Samsung' },
          { label: 'Oppo', href: '/category/mobile-phones?brands=Oppo' },
          { label: 'Nothing', href: '/category/mobile-phones?brands=Nothing' },
          { label: 'Redmi', href: '/category/mobile-phones?brands=Redmi' },
          { label: 'Xiaomi', href: '/category/mobile-phones?brands=Xiaomi' },
          { label: 'OnePlus', href: '/category/mobile-phones?brands=OnePlus' },
        ]
      }
    ]
  },
  { 
    name: 'Audio', 
    slug: 'audio', 
    hasDropdown: true,
    items: [
      {
        title: 'Top Audio Brands',
        links: [
          { label: 'JBL', href: '/products?brands=JBL' },
          { label: 'Marshall', href: '/products?brands=Marshall' },
          { label: 'KEF', href: '/products?brands=KEF' },
          { label: 'Sony', href: '/products?brands=Sony' },
          { label: 'YoloLiv', href: '/products?brands=YoloLiv' },
          { label: 'Devialet', href: '/products?brands=Devialet' },
          { label: 'Hollyland', href: '/products?brands=Hollyland' },
          { label: 'Saramonic', href: '/products?brands=Saramonic' },
          { label: 'Boya', href: '/products?brands=Boya' },
        ]
      },
      {
        title: 'Microphones',
        links: [
          { label: 'Lavalier Microphone', href: '/category/audio?search=lavalier' },
          { label: 'Wireless Microphone', href: '/category/audio?search=wireless-mic' },
          { label: 'USB Microphone', href: '/category/audio?search=usb-mic' },
          { label: 'Shotgun Microphone', href: '/category/audio?search=shotgun' },
          { label: 'Conference Microphone', href: '/category/audio?search=conference' },
          { label: 'Wireless Intercom System', href: '/category/audio?search=intercom' },
          { label: 'Wireless Transmission System', href: '/category/audio?search=transmission' },
          { label: 'Video Streaming Switcher', href: '/category/audio?search=switcher' },
          { label: 'Audio Mixer', href: '/category/audio?search=mixer' },
        ]
      },
      {
        title: 'Speaker and Earphones',
        links: [
          { label: 'Earphones', href: '/category/audio?search=earphones' },
          { label: 'Earbuds', href: '/category/audio?search=earbuds' },
          { label: 'Headphones', href: '/category/audio?search=headphones' },
          { label: 'Portable Bluetooth Speakers', href: '/category/audio?search=bluetooth-speaker' },
          { label: 'Multimedia Speakers', href: '/category/audio?search=multimedia' },
          { label: 'Party Speakers', href: '/category/audio?search=party-speaker' },
        ]
      },
      {
        title: 'Podcast',
        links: [
          { label: 'Podcast Microphones', href: '/category/audio?search=podcast-mic' },
          { label: 'Podcast Headphones', href: '/category/audio?search=podcast-headphone' },
          { label: 'Podcast System', href: '/category/audio?search=podcast-system' },
          { label: 'Live Content System', href: '/category/audio?search=live-content' },
          { label: 'Audio Switching', href: '/category/audio?search=audio-switching' },
        ]
      }
    ]
  },
  { 
    name: 'Accessories', 
    slug: 'accessories', 
    hasDropdown: true,
    items: [
      {
        title: 'Phone Cases',
        links: [
          { label: 'iPhone 17 Series', href: '/category/accessories?search=iphone-17-case' },
          { label: 'iPhone 16 Series', href: '/category/accessories?search=iphone-16-case' },
          { label: 'iPhone 15 Series', href: '/category/accessories?search=iphone-15-case' },
          { label: 'iPhone 14 Series', href: '/category/accessories?search=iphone-14-case' },
          { label: 'iPhone 13 Series', href: '/category/accessories?search=iphone-13-case' },
          { label: 'Other iPhone Series', href: '/category/accessories?search=iphone-case' },
          { label: 'Android Cases', href: '/category/accessories?search=android-case' },
        ]
      },
      {
        title: 'iPad Cases / Accessories',
        links: [
          { label: 'iPad Series', href: '/category/accessories?search=ipad-case' },
          { label: 'iPad Air Series', href: '/category/accessories?search=ipad-air-case' },
          { label: 'iPad Pro Series', href: '/category/accessories?search=ipad-pro-case' },
          { label: 'iPad Mini Series', href: '/category/accessories?search=ipad-mini-case' },
          { label: 'iPad Keyboard', href: '/category/accessories?search=ipad-keyboard' },
          { label: 'iPad Pencil', href: '/category/accessories?search=pencil' },
          { label: 'iPad Stand', href: '/category/accessories?search=ipad-stand' },
        ]
      },
      {
        title: 'MacBook Accessories',
        links: [
          { label: 'Hubs', href: '/category/accessories?search=hub' },
          { label: 'Sleeve / Cases', href: '/category/accessories?search=macbook-sleeve' },
          { label: 'Backpacks', href: '/category/accessories?search=backpack' },
          { label: 'Keyboard Protection', href: '/category/accessories?search=keyboard-cover' },
          { label: 'Webcam', href: '/category/accessories?search=webcam' },
        ]
      },
      {
        title: 'Charging',
        links: [
          { label: 'Audio / Video Cables', href: '/category/accessories?search=cable' },
          { label: 'Power Adapters', href: '/category/accessories?search=adapter' },
          { label: 'Charging Cables', href: '/category/accessories?search=charge-cable' },
          { label: 'Portable Chargers', href: '/category/accessories?search=power-bank' },
          { label: 'MagSafe Chargers', href: '/category/accessories?search=magsafe' },
          { label: 'Multiplugs', href: '/category/accessories?search=multiplug' },
        ]
      },
      {
        title: 'Screen Protector',
        links: [
          { label: 'iPhone', href: '/category/accessories?search=iphone-protector' },
          { label: 'iPad', href: '/category/accessories?search=ipad-protector' },
          { label: 'Apple Watch', href: '/category/accessories?search=watch-protector' },
          { label: 'MacBook', href: '/category/accessories?search=macbook-protector' },
        ]
      },
      {
        title: 'Data Storage',
        links: [
          { label: 'Thunderbolt Series', href: '/category/accessories?search=thunderbolt' },
          { label: 'Flash Drives', href: '/category/accessories?search=flash-drive' },
          { label: 'Memory Cards', href: '/category/accessories?search=memory-card' },
          { label: 'SSDs', href: '/category/accessories?search=ssd' },
        ]
      },
      {
        title: 'PC Accessories',
        links: [
          { label: 'Mouse', href: '/category/accessories?search=mouse' },
          { label: 'Keyboard', href: '/category/accessories?search=keyboard' },
        ]
      }
    ]
  },
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
