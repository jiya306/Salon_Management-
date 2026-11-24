export type UserRole = 'ADMIN' | 'SALON_OWNER' | 'RECEPTIONIST' | 'STYLIST' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export type ServiceCategory = 'Hair' | 'Beauty' | 'Nails' | 'Bridal' | 'Spa';

export interface Service {
  _id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  isActive: boolean;
  popularStatus: boolean;
  rating: number;
  reviewCount: number;
}

export interface Staff {
  _id: string;
  employeeId: string;
  fullName: string;
  profileImage: string;
  phone: string;
  email: string;
  role: string;
  specialization: string;
  experience: number;
  salary: number;
  commission: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  leaveStatus: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  revenueGenerated: number;
}

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
  registrationDate: string;
  totalVisits: number;
  totalSpending: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  preferredStylist?: Staff;
  preferredServices?: Service[];
  notes?: string;
  lastAppointment?: string;
}

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked In'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type PaymentStatus = 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';

export interface Appointment {
  _id: string;
  appointmentId: string;
  customer: Customer | string;
  customerName: string;
  customerPhone: string;
  service: Service | string;
  serviceName: string;
  stylist: Staff | string;
  stylistName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  discount: number;
  finalPrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  bookingSource: string;
  createdAt: string;
}

export interface InvoiceService {
  serviceId?: string;
  name: string;
  price: number;
  duration: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Customer | string;
  customerName: string;
  customerPhone?: string;
  appointment?: Appointment | string;
  services: InvoiceService[];
  subtotal: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';
  issueDate: string;
  paymentDate?: string;
  notes?: string;
}

export interface Payment {
  _id: string;
  invoiceNumber: string;
  appointment?: Appointment | string;
  customer: Customer | string;
  customerName: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';
  transactionId?: string;
  notes?: string;
  paidAt: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InventoryTransaction {
  _id: string;
  product: string;
  productName: string;
  sku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  date: string;
}

export interface Promotion {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  _id: string;
  customerName: string;
  customerAvatar?: string;
  serviceName: string;
  stylistName: string;
  rating: number;
  reviewText: string;
  date: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'PAYMENT' | 'INVENTORY' | 'REVIEW' | 'CUSTOMER';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SalonSettings {
  _id?: string;
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
  loyaltyEarnRate: number;
  loyaltyRedemptionRate: number;
}
