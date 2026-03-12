import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  userId: Types.ObjectId;
  productId?: Types.ObjectId;
  serviceId?: Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ serviceId: 1 });

export const Review = model<IReview>('Review', reviewSchema);
