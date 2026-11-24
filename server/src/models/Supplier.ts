import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    categories: [{ type: String }],
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
