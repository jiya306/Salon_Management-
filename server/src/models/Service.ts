import mongoose, { Document, Schema } from 'mongoose';

export type ServiceCategory = 'Hair' | 'Beauty' | 'Nails' | 'Bridal' | 'Spa';

export interface IService extends Document {
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number; // minutes
  image: string;
  isActive: boolean;
  popularStatus: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Hair', 'Beauty', 'Nails', 'Bridal', 'Spa'],
      index: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 10 }, // duration in mins
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    popularStatus: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
