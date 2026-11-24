import { Request, Response, NextFunction } from 'express';
import { Customer, Appointment, Payment, LoyaltyTransaction } from '../models/index.js';

export const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, tier, sort = '-createdAt', page = '1', limit = '50' } = req.query;

    const query: any = {};
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { fullName: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ];
    }
    if (tier && tier !== 'All') {
      query.loyaltyTier = tier;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .populate('preferredStylist', 'fullName specialization profileImage')
        .populate('preferredServices', 'name category price')
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      Customer.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('preferredStylist', 'fullName specialization profileImage email phone')
      .populate('preferredServices', 'name category price duration');

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, phone, email, dateOfBirth, address, notes, preferredStylist, preferredServices } = req.body;

    const existing = await Customer.findOne({ $or: [{ phone }, { email: email.toLowerCase() }] });
    if (existing) {
      res.status(400).json({ success: false, message: 'A customer with this phone or email already exists' });
      return;
    }

    const customer = new Customer({
      fullName,
      phone,
      email: email.toLowerCase(),
      dateOfBirth,
      address,
      notes,
      preferredStylist,
      preferredServices: preferredServices || [],
      loyaltyPoints: 50,
      loyaltyTier: 'Bronze',
      registrationDate: new Date(),
    });

    await customer.save();

    res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Customer removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCustomerAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointments = await Appointment.find({ customer: req.params.id })
      .populate('service', 'name category price duration')
      .populate('stylist', 'fullName profileImage specialization')
      .sort({ appointmentDate: -1, startTime: -1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getCustomerPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ customer: req.params.id }).sort({ paidAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const getCustomerLoyalty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transactions = await LoyaltyTransaction.find({ customer: req.params.id }).sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};
