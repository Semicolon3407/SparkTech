import type { Product, ProductFilters, PaginatedResponse } from '@/types';

// Temporarily using mock data till DB is populated but structured for real use
const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    description: 'The most powerful iPhone ever with A17 Pro chip. Features a stunning 6.7-inch Super Retina XDR display, titanium design, and the most advanced camera system in an iPhone.',
    price: 199999,
    comparePrice: 219999,
    category: 'apple',
    subcategory: 'iPhone',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800'],
    stock: 15,
    sku: 'IP15PM-256-NT',
    specifications: [
      { key: 'Display', value: '6.7" Super Retina XDR' },
      { key: 'Chip', value: 'A17 Pro' },
    ],
    features: ['Titanium design', 'Action button', 'USB-C'],
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    description: 'Ultimate Galaxy experience with AI features',
    price: 179999,
    comparePrice: 189999,
    category: 'android',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    stock: 20,
    sku: 'SGS24U-512',
    specifications: [],
    features: [],
    rating: 4.7,
    reviewCount: 89,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    name: 'ANTIGRAVITY Λ1 Drone (8K 360)',
    slug: 'antigravity-drone',
    description: 'Experience 8K aerial cinematography with 360-degree obstacle sensing and unprecedented stability.',
    price: 245000,
    comparePrice: 265000,
    category: 'lifestyle',
    brand: 'ANTIGRAVITY',
    images: ['https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?w=800'],
    stock: 5,
    sku: 'AG-A1-DRONE',
    specifications: [{ key: 'Res', value: '8K 360' }],
    features: ['360 Sensing', '10km Range'],
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    name: 'XREAL One Pro - AR Glasses',
    slug: 'ar-glasses',
    description: 'Experience the digital world like never before with crystal clear AR visuals.',
    price: 85000,
    comparePrice: 95000,
    category: 'lifestyle',
    brand: 'XREAL',
    images: ['https://images.unsplash.com/photo-1621330396173-e41da1bafe7d?w=800'],
    stock: 12,
    sku: 'XREAL-OP',
    specifications: [],
    features: [],
    rating: 4.7,
    reviewCount: 28,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '7',
    name: 'Dyson Airwrap Styler',
    slug: 'styler',
    description: 'Style your hair with air, not extreme heat. Engineered for multiple hair types.',
    price: 65000,
    comparePrice: 75000,
    category: 'lifestyle',
    brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1640585123231-9df03775b733?w=800'],
    stock: 18,
    sku: 'DYSON-AW',
    specifications: [],
    features: [],
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '8',
    name: 'Levoit Core 300 Air Purifier',
    slug: 'purifier',
    description: 'High-performance HEPA air purifier for clean, fresh air at home.',
    price: 25000,
    comparePrice: 29000,
    category: 'lifestyle',
    brand: 'Levoit',
    images: ['https://images.unsplash.com/photo-1585333120111-9f9394621c17?w=800'],
    stock: 25,
    sku: 'LEVOIT-300',
    specifications: [],
    features: [],
    rating: 4.5,
    reviewCount: 94,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation',
    price: 39999,
    comparePrice: 44999,
    category: 'audio',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    stock: 30,
    sku: 'SONY-WH1000XM5',
    specifications: [],
    features: [],
    rating: 4.6,
    reviewCount: 203,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

];

export const ProductService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const { 
      page = 1, 
      limit = 12, 
      sort = 'newest', 
      category, 
      brand, 
      isFeatured,
      minPrice, 
      maxPrice, 
      search 
    } = filters;

    let filtered = [...MOCK_PRODUCTS];

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === isFeatured);
    }

    if (brand) {
      const brands = brand.split(',');
      filtered = filtered.filter(p => brands.includes(p.brand));
    }


    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  },

  async getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
    return MOCK_PRODUCTS
      .filter(p => p.category === category && p._id !== currentId)
      .slice(0, 4);
  },

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    return MOCK_PRODUCTS.filter(p => ids.includes(p._id));
  }
};
