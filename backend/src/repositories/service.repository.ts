import { Service, IService } from '../models/Service';
import { FilterQuery } from 'mongoose';

export class ServiceRepository {
  findAll(filter: FilterQuery<IService> = {}) {
    return Service.find({ ...filter, isActive: true }).populate('providerId', 'expertiseArea averageRating');
  }

  findById(id: string) {
    return Service.findById(id).populate('providerId', 'expertiseArea averageRating yearsExperience');
  }

  findByProvider(providerId: string) {
    return Service.find({ providerId });
  }

  create(data: Partial<IService>) {
    return Service.create(data);
  }

  update(id: string, data: Partial<IService>) {
    return Service.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}
