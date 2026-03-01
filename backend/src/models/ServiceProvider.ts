import { Schema, model, Document, Types } from 'mongoose';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface IServiceProvider extends Document {
  userId: Types.ObjectId;
  expertiseArea: string;
  yearsExperience: number;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalReviews: number;
}

const serviceProviderSchema = new Schema<IServiceProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    expertiseArea: { type: String, required: true },
    yearsExperience: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServiceProvider = model<IServiceProvider>('ServiceProvider', serviceProviderSchema);
