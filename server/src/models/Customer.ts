import mongoose, { Document, Schema } from 'mongoose';

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface ICustomer extends Document {
  user?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
  registrationDate: Date;
  totalVisits: number;
  totalSpending: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  preferredStylist?: mongoose.Types.ObjectId;
  preferredServices: mongoose.Types.ObjectId[];
  notes?: string;
  lastAppointment?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    dateOfBirth: { type: String },
    address: { type: String, default: '' },
    registrationDate: { type: Date, default: Date.now },
    totalVisits: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
    preferredStylist: { type: Schema.Types.ObjectId, ref: 'Staff' },
    preferredServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    notes: { type: String, default: '' },
    lastAppointment: { type: Date },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
