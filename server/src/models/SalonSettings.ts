import mongoose, { Document, Schema } from 'mongoose';

export interface ISalonSettings extends Document {
  salonName: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  closingHours: string;
  workingDays: string[];
  durationStepMinutes: number;
  bufferTimeMinutes: number;
  cancelWindowHours: number;
  taxRatePercent: number;
  loyaltyEarnRate: number; // e.g. 1 point per 100 spent
  loyaltyRedemptionRate: number; // e.g. 1 point = 1 INR
  createdAt: Date;
  updatedAt: Date;
}

const SalonSettingsSchema = new Schema<ISalonSettings>(
  {
    salonName: { type: String, default: 'SalonFlow Luxury Studio' },
    tagline: { type: String, default: 'Your Beauty. Your Time. Your Salon.' },
    logo: { type: String, default: '' },
    address: { type: String, default: 'Plot 42, Bandra West, Mumbai, Maharashtra 400050' },
    phone: { type: String, default: '+91 98200 12345' },
    email: { type: String, default: 'concierge@salonflow.com' },
    openingHours: { type: String, default: '09:00' },
    closingHours: { type: String, default: '20:00' },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    durationStepMinutes: { type: Number, default: 30 },
    bufferTimeMinutes: { type: Number, default: 15 },
    cancelWindowHours: { type: Number, default: 4 },
    taxRatePercent: { type: Number, default: 18 },
    loyaltyEarnRate: { type: Number, default: 1 }, // 1 pt per 100
    loyaltyRedemptionRate: { type: Number, default: 1 }, // 1 pt = 1 rupee
  },
  { timestamps: true }
);

export const SalonSettings = mongoose.model<ISalonSettings>('SalonSettings', SalonSettingsSchema);
