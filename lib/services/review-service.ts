import connectDB from '@/lib/db/mongodb';
import ReviewModel from '@/lib/db/models/review';
import './user-model-register'; // Ensure User model is registered

export const ReviewService = {
  async getProductReviews(productId: string) {
    try {
      await connectDB();
      const reviews = await ReviewModel.find({ product: productId })
        .populate('user', 'name image')
        .sort({ createdAt: -1 })
        .lean();
      
      return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }
};
