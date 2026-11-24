import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryTransaction extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  date: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, required: true },
    performedBy: { type: String, default: 'Admin' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InventoryTransaction = mongoose.model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
);
