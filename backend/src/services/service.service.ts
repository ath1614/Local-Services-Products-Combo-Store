import { ServiceRepository } from '../repositories/service.repository';
import { ServiceProvider } from '../models/ServiceProvider';

const repo = new ServiceRepository();

export class ServiceService {
  async getAll(category?: string) {
    return repo.findAll(category ? { category } : {});
  }

  async getById(id: string) {
    const service = await repo.findById(id);
    if (!service) throw new Error('Service not found');
    return service;
  }

  async create(userId: string, data: any) {
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) throw new Error('Service provider profile not found');
    return repo.create({ ...data, providerId: provider._id });
  }

  async update(userId: string, serviceId: string, data: any) {
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) throw new Error('Provider profile not found');
    const service = await repo.findById(serviceId);
    if (!service || service.providerId.toString() !== provider._id.toString())
      throw new Error('Not authorized');
    return repo.update(serviceId, data);
  }

  async delete(userId: string, serviceId: string) {
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) throw new Error('Provider profile not found');
    const service = await repo.findById(serviceId);
    if (!service || service.providerId.toString() !== provider._id.toString())
      throw new Error('Not authorized');
    return repo.delete(serviceId);
  }

  async getMyServices(userId: string) {
    const provider = await ServiceProvider.findOne({ userId });
    if (!provider) throw new Error('Provider profile not found');
    return repo.findByProvider(provider._id.toString());
  }
}
