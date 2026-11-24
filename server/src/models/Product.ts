import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    category: { type: String, required: true, trim: true },
    supplier: { type: String, required: true, trim: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, required: true, default: 5 },
    expiryDate: { type: String },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
      index: true,
    },
  },
  { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  if (this.stockQuantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.stockQuantity <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
