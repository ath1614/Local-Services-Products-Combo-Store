import { Schema, model, Document, Types } from 'mongoose';

export interface IService extends Document {
  providerId: Types.ObjectId;
  title: string;
  description: string;
  basePrice: number;
  durationEst: string;
  category: string;
  allowsSameDay: boolean;
  isActive: boolean;
}

const serviceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    basePrice: { type: Number, required: true, min: 0 },
    durationEst: { type: String, default: '1 hour' },
    category: { type: String, required: true },
    allowsSameDay: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1 });
serviceSchema.index({ title: 'text', description: 'text' });

export const Service = model<IService>('Service', serviceSchema);
