import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceService {
  serviceId?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  duration: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  appointment?: mongoose.Types.ObjectId;
  services: IInvoiceService[];
  subtotal: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';
  paymentDate?: Date;
  issueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, default: 30 },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Online'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
      default: 'Paid',
    },
    paymentDate: { type: Date, default: Date.now },
    issueDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
