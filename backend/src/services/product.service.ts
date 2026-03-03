import { ProductRepository } from '../repositories/product.repository';
import { Vendor } from '../models/Vendor';

const repo = new ProductRepository();

export class ProductService {
  async getAll(category?: string) {
    return repo.findAll(category ? { category } : {});
  }

  async getById(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async create(userId: string, data: any) {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error('Vendor profile not found');
    return repo.create({ ...data, vendorId: vendor._id });
  }

  async update(userId: string, productId: string, data: any) {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error('Vendor profile not found');
    const product = await repo.findById(productId);
    if (!product || product.vendorId.toString() !== vendor._id.toString())
      throw new Error('Not authorized to update this product');
    return repo.update(productId, data);
  }

  async delete(userId: string, productId: string) {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error('Vendor profile not found');
    const product = await repo.findById(productId);
    if (!product || product.vendorId.toString() !== vendor._id.toString())
      throw new Error('Not authorized');
    return repo.delete(productId);
  }

  async getMyProducts(userId: string) {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error('Vendor profile not found');
    return repo.findByVendor(vendor._id.toString());
  }
}
