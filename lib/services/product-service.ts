import type { Product, ProductFilters, PaginatedResponse } from '@/types';
import connectDB from '@/lib/db/mongodb';
import ProductModel from '@/lib/db/models/product';

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
      search,
      colors,
      inStock
    } = filters;

    try {
      await connectDB();
      
      let query: any = { isActive: true };
      if (category) query.category = category;
      if (isFeatured !== undefined) query.isFeatured = isFeatured;
      
      if (brand) {
        const brandList = brand.split(',');
        query.brand = { $in: brandList.map(b => new RegExp(`^${b}$`, 'i')) };
      }
      
      if (colors) {
        const colorList = colors.split(',');
        query.colors = { $in: colorList.map(c => new RegExp(`^${c}$`, 'i')) };
      }

      if (inStock === true) {
        query.stock = { $gt: 0 };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }


      // Sort
      let sortObj: any = { createdAt: -1 };
      switch (sort) {
        case 'price-asc': sortObj = { price: 1 }; break;
        case 'price-desc': sortObj = { price: -1 }; break;
        case 'popular':
        case 'rating': sortObj = { rating: -1 }; break;
      }

      const total = await ProductModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const rawData = await ProductModel.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Convert _id and dates to plain values for RSC serialization
      const data = JSON.parse(JSON.stringify(rawData));

      return {
        success: true,
        data,
        pagination: { page, limit, total, totalPages }
      };

    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      await connectDB();
      const product = await ProductModel.findOne({ slug, isActive: true }).lean();
      return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error) {
      return null;
    }
  },

  async getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
    try {
      await connectDB();
      const products = await ProductModel.find({ 
        category, 
        _id: { $ne: currentId },
        isActive: true 
      }).limit(4).lean();
      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      return [];
    }
  },

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    try {
      await connectDB();
      const products = await ProductModel.find({ _id: { $in: ids }, isActive: true }).lean();
      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      return [];
    }
  }
};
