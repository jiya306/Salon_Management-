import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  user?: mongoose.Types.ObjectId;
  employeeId: string;
  fullName: string;
  profileImage: string;
  phone: string;
  email: string;
  role: string;
  specialization: string;
  experience: number;
  salary: number;
  commission: number; // percentage
  workingDays: string[];
  workingHours: {
    start: string; // '09:00'
    end: string;   // '19:00'
  };
  leaveStatus: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  revenueGenerated: number;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, required: true, default: 'Stylist' },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true, default: 1 },
    salary: { type: Number, required: true, default: 30000 },
    commission: { type: Number, default: 10 },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '19:00' },
    },
    leaveStatus: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
