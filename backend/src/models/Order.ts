import { Schema, model, Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IOrderItem {
  productId?: Types.ObjectId;
  serviceId?: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  scheduledTime?: Date;
  notes?: string;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentIntentId?: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  scheduledTime: { type: Date, default: null },
  notes: { type: String, default: '' },
});

const orderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    deliveryAddress: { type: String, required: true },
    paymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1, createdAt: -1 });

export const Order = model<IOrder>('Order', orderSchema);
