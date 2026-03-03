import { Product, IProduct } from '../models/Product';
import { FilterQuery } from 'mongoose';

export class ProductRepository {
  findAll(filter: FilterQuery<IProduct> = {}) {
    return Product.find({ ...filter, isActive: true }).populate('vendorId', 'shopName');
  }

  findById(id: string) {
    return Product.findById(id).populate('vendorId', 'shopName shopAddress');
  }

  findByVendor(vendorId: string) {
    return Product.find({ vendorId });
  }

  create(data: Partial<IProduct>) {
    return Product.create(data);
  }

  update(id: string, data: Partial<IProduct>) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  search(query: string, category?: string) {
    const filter: FilterQuery<IProduct> = {
      isActive: true,
      $text: { $search: query },
    };
    if (category) filter.category = category;
    return Product.find(filter).populate('vendorId', 'shopName');
  }
}
