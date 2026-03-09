import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { OrderStatus } from '../models/Order';

const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();

interface CartItem {
  productId?: string;
  serviceId?: string;
  quantity: number;
  scheduledTime?: string;
  notes?: string;
}

export class OrderService {
  async createOrder(customerId: string, items: CartItem[], deliveryAddress: string) {
    if (!items || items.length === 0) throw new Error('Cart is empty');

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      if (item.productId) {
        const product = await productRepo.findById(item.productId);
        if (!product || !product.isActive) throw new Error(`Product ${item.productId} not available`);
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
        totalAmount += product.price * item.quantity;
        resolvedItems.push({ productId: product._id, quantity: item.quantity, unitPrice: product.price, notes: item.notes });
      } else if (item.serviceId) {
        const { Service } = await import('../models/Service');
        const service = await Service.findById(item.serviceId);
        if (!service || !service.isActive) throw new Error(`Service ${item.serviceId} not available`);
        totalAmount += service.basePrice * item.quantity;
        resolvedItems.push({
          serviceId: service._id,
          quantity: item.quantity,
          unitPrice: service.basePrice,
          scheduledTime: item.scheduledTime ? new Date(item.scheduledTime) : undefined,
          notes: item.notes,
        });
      }
    }

    // Decrement stock for products
    for (const item of items) {
      if (item.productId) {
        await import('../models/Product').then(({ Product }) =>
          Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
        );
      }
    }

    const order = await orderRepo.create({
      customerId: customerId as any,
      items: resolvedItems as any,
      totalAmount,
      deliveryAddress,
      status: OrderStatus.PAID, // simulating payment success
    });

    return order;
  }

  async getMyOrders(customerId: string) {
    return orderRepo.findByCustomer(customerId);
  }

  async getOrderById(customerId: string, orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.customerId.toString() !== customerId) throw new Error('Not authorized');
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await orderRepo.updateStatus(orderId, status);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async cancelOrder(customerId: string, orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.customerId.toString() !== customerId) throw new Error('Not authorized');
    if ([OrderStatus.SHIPPED, OrderStatus.COMPLETED].includes(order.status))
      throw new Error('Cannot cancel order at this stage');
    return orderRepo.updateStatus(orderId, OrderStatus.CANCELLED);
  }
}
