import { Request, Response, NextFunction } from 'express';
import { Invoice, Appointment, Customer, Payment, Notification } from '../models/index.js';

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, limit = '100' } = req.query;
    const query: any = {};

    if (status && status !== 'All') query.paymentStatus = status;
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ customerName: regex }, { invoiceNumber: regex }];
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'fullName phone email address')
      .populate('appointment')
      .sort({ issueDate: -1 })
      .limit(parseInt(limit as string, 10));

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('appointment');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      customerId,
      appointmentId,
      services,
      discount = 0,
      paymentMethod = 'UPI',
      paymentStatus = 'Paid',
      notes,
    } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const subtotal = services.reduce((sum: number, s: any) => sum + Number(s.price || 0), 0);
    const taxableAmount = Math.max(0, subtotal - Number(discount || 0));
    const tax = Math.round(taxableAmount * 0.18); // 18% GST
    const finalAmount = taxableAmount + tax;

    const invoice = new Invoice({
      invoiceNumber,
      customer: customer._id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      appointment: appointmentId,
      services,
      subtotal,
      discount,
      tax,
      finalAmount,
      paymentMethod,
      paymentStatus,
      paymentDate: paymentStatus === 'Paid' ? new Date() : undefined,
      issueDate: new Date(),
      notes,
    });

    await invoice.save();

    if (paymentStatus === 'Paid') {
      await Payment.create({
        invoiceNumber,
        appointment: appointmentId,
        customer: customer._id,
        customerName: customer.fullName,
        amount: finalAmount,
        paymentMethod,
        paymentStatus: 'Paid',
        transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
        notes: `Payment for invoice ${invoiceNumber}`,
        paidAt: new Date(),
      });

      if (appointmentId) {
        await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: 'Paid' });
      }
    }

    res.status(201).json({ success: true, message: 'Invoice generated successfully', data: invoice });
  } catch (error) {
    next(error);
  }
};
