import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerAvatar?: string;
  appointment?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  serviceName: string;
  stylist?: mongoose.Types.ObjectId;
  stylistName: string;
  rating: number; // 1 to 5
  reviewText: string;
  isApproved: boolean;
  date: Date;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    customerAvatar: { type: String, default: '' },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'Staff' },
    stylistName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
