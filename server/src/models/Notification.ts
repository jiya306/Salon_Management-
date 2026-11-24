import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'PAYMENT' | 'INVENTORY' | 'REVIEW' | 'CUSTOMER';
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['APPOINTMENT', 'PAYMENT', 'INVENTORY', 'REVIEW', 'CUSTOMER'],
      required: true,
    },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
