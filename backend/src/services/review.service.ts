import { Review } from '../models/Review';
import { ServiceProvider } from '../models/ServiceProvider';

export class ReviewService {
  async create(userId: string, data: { productId?: string; serviceId?: string; rating: number; comment: string }) {
    if (!data.productId && !data.serviceId) throw new Error('Must review a product or service');
    const review = await Review.create({ userId, ...data });

    // Update average rating on ServiceProvider if service review
    if (data.serviceId) {
      const { Service } = await import('../models/Service');
      const service = await Service.findById(data.serviceId);
      if (service) {
        const stats = await Review.aggregate([
          { $match: { serviceId: service._id } },
          { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (stats.length > 0) {
          await ServiceProvider.findByIdAndUpdate(service.providerId, {
            averageRating: Math.round(stats[0].avg * 10) / 10,
            totalReviews: stats[0].count,
          });
        }
      }
    }

    return review;
  }

  async getForProduct(productId: string) {
    return Review.find({ productId }).populate('userId', 'name').sort({ createdAt: -1 });
  }

  async getForService(serviceId: string) {
    return Review.find({ serviceId }).populate('userId', 'name').sort({ createdAt: -1 });
  }
}
