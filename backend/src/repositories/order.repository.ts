import { Order, IOrder, OrderStatus } from '../models/Order';

export class OrderRepository {
  create(data: Partial<IOrder>) {
    return Order.create(data);
  }

  findById(id: string) {
    return Order.findById(id)
      .populate('items.productId', 'name imageUrl')
      .populate('items.serviceId', 'title category');
  }

  findByCustomer(customerId: string) {
    return Order.find({ customerId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name imageUrl')
      .populate('items.serviceId', 'title category');
  }

  findByVendorProducts(productIds: string[]) {
    return Order.find({ 'items.productId': { $in: productIds } }).sort({ createdAt: -1 });
  }

  updateStatus(id: string, status: OrderStatus) {
    return Order.findByIdAndUpdate(id, { status }, { new: true });
  }
}
