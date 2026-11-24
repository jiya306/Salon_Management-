import mongoose, { Document, Schema } from 'mongoose';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked In'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type PaymentStatus = 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';

export interface IAppointment extends Document {
  appointmentId: string;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  service: mongoose.Types.ObjectId;
  serviceName: string;
  stylist: mongoose.Types.ObjectId;
  stylistName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  price: number;
  discount: number;
  finalPrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  bookingSource: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    stylistName: { type: String, required: true },
    appointmentDate: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    startTime: { type: String, required: true }, // Format: HH:mm
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
    bookingSource: { type: String, default: 'Online Wizard' },
  },
  { timestamps: true }
);

// Compound index to quickly find conflicts for the same stylist on the same date
AppointmentSchema.index({ stylist: 1, appointmentDate: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
