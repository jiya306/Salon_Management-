import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  invoiceNumber: string;
  appointment?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';
  transactionId?: string;
  notes?: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceNumber: { type: String, required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Online'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
      default: 'Paid',
    },
    transactionId: { type: String },
    notes: { type: String },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
