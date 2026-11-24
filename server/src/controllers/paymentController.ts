import { Request, Response, NextFunction } from 'express';
import { Payment, Invoice, Appointment, Customer, Notification } from '../models/index.js';

export const getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { method, status, search, limit = '100' } = req.query;
    const query: any = {};

    if (method && method !== 'All') query.paymentMethod = method;
    if (status && status !== 'All') query.paymentStatus = status;
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ customerName: regex }, { invoiceNumber: regex }, { transactionId: regex }];
    }

    const payments = await Payment.find(query)
      .populate('appointment')
      .populate('customer', 'fullName phone email')
      .sort({ paidAt: -1 })
      .limit(parseInt(limit as string, 10));

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('customer');

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found' });
      return;
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { appointmentId, customerId, amount, paymentMethod, notes, transactionId } = req.body;

    let customerName = 'Guest Customer';
    if (customerId) {
      const cust = await Customer.findById(customerId);
      if (cust) customerName = cust.fullName;
    }

    const count = await Payment.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const payment = new Payment({
      invoiceNumber,
      appointment: appointmentId,
      customer: customerId,
      customerName,
      amount,
      paymentMethod,
      paymentStatus: 'Paid',
      transactionId: transactionId || `TXN-${Date.now().toString(36).toUpperCase()}`,
      notes,
      paidAt: new Date(),
    });

    await payment.save();

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'Paid',
      });
    }

    await Notification.create({
      title: 'Payment Received',
      message: `₹${amount} received via ${paymentMethod} from ${customerName}.`,
      type: 'PAYMENT',
      link: `/dashboard/billing`,
    });

    res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    next(error);
  }
};
