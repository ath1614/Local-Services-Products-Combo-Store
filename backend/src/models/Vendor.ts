import { Schema, model, Document, Types } from 'mongoose';

export interface IVendor extends Document {
  userId: Types.ObjectId;
  shopName: string;
  shopAddress: string;
  businessLicense: string;
  isVerified: boolean;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    shopName: { type: String, required: true, trim: true },
    shopAddress: { type: String, required: true },
    businessLicense: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Vendor = model<IVendor>('Vendor', vendorSchema);
