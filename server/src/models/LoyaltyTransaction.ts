import mongoose, { Document, Schema } from 'mongoose';

export interface ILoyaltyTransaction extends Document {
  customer: mongoose.Types.ObjectId;
  customerName: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS';
  description: string;
  date: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    points: { type: Number, required: true },
    type: { type: String, enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS'], required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LoyaltyTransaction = mongoose.model<ILoyaltyTransaction>(
  'LoyaltyTransaction',
  LoyaltyTransactionSchema
);
