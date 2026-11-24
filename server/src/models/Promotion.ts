import mongoose, { Document, Schema } from 'mongoose';

export interface IPromotion extends Document {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  usageLimit: number;
  usedCount: number;
  customerUsageLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 }, // 0 means no cap for percentage
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    customerUsageLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Promotion = mongoose.model<IPromotion>('Promotion', PromotionSchema);
