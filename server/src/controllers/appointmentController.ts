import { Request, Response, NextFunction } from 'express';
import { Appointment, Service, Staff, Customer, Notification, LoyaltyTransaction, SalonSettings } from '../models/index.js';

// Helper to convert 'HH:mm' to minutes from midnight
const timeToMins = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes to 'HH:mm'
const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, startDate, endDate, stylist, customer, status, search, page = '1', limit = '100' } = req.query;

    const query: any = {};
    if (date) {
      query.appointmentDate = date;
    } else if (startDate && endDate) {
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    if (stylist && stylist !== 'all') {
      query.stylist = stylist;
    }
    if (customer) {
      query.customer = customer;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { appointmentId: searchRegex },
        { customerName: searchRegex },
        { customerPhone: searchRegex },
        { serviceName: searchRegex },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('customer', 'fullName phone email loyaltyTier loyaltyPoints')
        .populate('stylist', 'fullName profileImage specialization phone')
        .populate('service', 'name category price duration image')
        .sort({ appointmentDate: -1, startTime: -1 })
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: appointments,
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

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('stylist')
      .populate('service');

    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      serviceId,
      stylistId,
      appointmentDate,
      startTime,
      customerName,
      customerPhone,
      customerEmail,
      customerId,
      notes,
      discount = 0,
      bookingSource = 'Online Wizard',
    } = req.body;

    if (!serviceId || !appointmentDate || !startTime || !customerName || !customerPhone) {
      res.status(400).json({ success: false, message: 'Please provide all required appointment details' });
      return;
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ success: false, message: 'Selected service not found' });
      return;
    }

    // Resolve Stylist: if stylistId is 'any' or missing, pick an available active stylist
    let assignedStylist: any = null;
    const duration = service.duration;
    const reqStartMins = timeToMins(startTime);
    const reqEndMins = reqStartMins + duration;
    const endTime = minsToTime(reqEndMins);

    if (stylistId && stylistId !== 'any') {
      assignedStylist = await Staff.findById(stylistId);
      if (!assignedStylist) {
        res.status(404).json({ success: false, message: 'Selected stylist not found' });
        return;
      }
    } else {
      // Find all active stylists
      const activeStylists = await Staff.find({ isActive: true, leaveStatus: false });
      if (activeStylists.length === 0) {
        res.status(400).json({ success: false, message: 'No stylists currently available' });
        return;
      }

      // Check which stylist is free in that slot
      for (const st of activeStylists) {
        const existingBookings = await Appointment.find({
          stylist: st._id,
          appointmentDate,
          status: { $nin: ['Cancelled', 'No Show'] },
        });

        const hasConflict = existingBookings.some((b) => {
          const bStart = timeToMins(b.startTime);
          const bEnd = timeToMins(b.endTime);
          return Math.max(reqStartMins, bStart) < Math.min(reqEndMins, bEnd);
        });

        if (!hasConflict) {
          assignedStylist = st;
          break;
        }
      }

      if (!assignedStylist) {
        res.status(400).json({ success: false, message: 'No stylists are available at the selected time slot. Please choose another time.' });
        return;
      }
    }

    // Double-booking check for specific assigned stylist
    const existingBookings = await Appointment.find({
      stylist: assignedStylist._id,
      appointmentDate,
      status: { $nin: ['Cancelled', 'No Show'] },
    });

    const conflict = existingBookings.find((b) => {
      const bStart = timeToMins(b.startTime);
      const bEnd = timeToMins(b.endTime);
      return Math.max(reqStartMins, bStart) < Math.min(reqEndMins, bEnd);
    });

    if (conflict) {
      res.status(409).json({
        success: false,
        message: `${assignedStylist.fullName} already has a booking from ${conflict.startTime} to ${conflict.endTime} on ${appointmentDate}. Please choose another time or stylist.`,
      });
      return;
    }

    // Resolve or create Customer
    let resolvedCustomer: any = null;
    if (customerId) {
      resolvedCustomer = await Customer.findById(customerId);
    }
    if (!resolvedCustomer) {
      resolvedCustomer = await Customer.findOne({ phone: customerPhone });
    }
    if (!resolvedCustomer) {
      resolvedCustomer = await Customer.create({
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail || `${customerPhone.replace(/\D/g, '')}@guest.salonflow.com`,
        registrationDate: new Date(),
        totalVisits: 0,
        totalSpending: 0,
        loyaltyPoints: 50,
        loyaltyTier: 'Bronze',
        preferredStylist: assignedStylist._id,
        preferredServices: [service._id],
      });
    }

    const count = await Appointment.countDocuments();
    const appointmentId = `APT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const price = service.price;
    const finalPrice = Math.max(0, price - (discount || 0));

    const appointment = new Appointment({
      appointmentId,
      customer: resolvedCustomer._id,
      customerName: resolvedCustomer.fullName,
      customerPhone: resolvedCustomer.phone,
      service: service._id,
      serviceName: service.name,
      stylist: assignedStylist._id,
      stylistName: assignedStylist.fullName,
      appointmentDate,
      startTime,
      endTime,
      duration,
      price,
      discount: discount || 0,
      finalPrice,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      notes,
      bookingSource,
    });

    await appointment.save();

    // Create Notification
    await Notification.create({
      title: 'New Appointment Booked',
      message: `${resolvedCustomer.fullName} booked ${service.name} with ${assignedStylist.fullName} on ${appointmentDate} at ${startTime}.`,
      type: 'APPOINTMENT',
      link: `/dashboard/appointments`,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Appointment updated successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    // If status became Completed, update customer visits and loyalty points!
    if (status === 'Completed') {
      const customer = await Customer.findById(appointment.customer);
      if (customer) {
        customer.totalVisits += 1;
        customer.totalSpending += appointment.finalPrice;
        customer.lastAppointment = new Date();
        const earnedPoints = Math.floor(appointment.finalPrice / 100);
        customer.loyaltyPoints += earnedPoints;

        if (customer.totalSpending >= 50000) customer.loyaltyTier = 'Platinum';
        else if (customer.totalSpending >= 25000) customer.loyaltyTier = 'Gold';
        else if (customer.totalSpending >= 10000) customer.loyaltyTier = 'Silver';
        else customer.loyaltyTier = 'Bronze';

        await customer.save();

        if (earnedPoints > 0) {
          await LoyaltyTransaction.create({
            customer: customer._id,
            customerName: customer.fullName,
            points: earnedPoints,
            type: 'EARNED',
            description: `Earned from appointment ${appointment.appointmentId} (${appointment.serviceName})`,
            date: new Date(),
          });
        }
      }

      // Update staff revenue
      await Staff.findByIdAndUpdate(appointment.stylist, {
        $inc: { revenueGenerated: appointment.finalPrice },
      });
    }

    res.status(200).json({ success: true, message: `Appointment status updated to ${status}`, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Appointment removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, stylistId, duration = '45' } = req.query;

    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required to check availability' });
      return;
    }

    const durationMins = parseInt(duration as string, 10) || 45;
    const openMins = timeToMins('09:00');
    const closeMins = timeToMins('20:00');
    const slotStep = 30; // Every 30 mins

    const query: any = {
      appointmentDate: date,
      status: { $nin: ['Cancelled', 'No Show'] },
    };

    if (stylistId && stylistId !== 'any') {
      query.stylist = stylistId;
    }

    const existingAppointments = await Appointment.find(query);
    const activeStylists = await Staff.find({ isActive: true, leaveStatus: false });

    const totalStylistCapacity = (stylistId && stylistId !== 'any') ? 1 : activeStylists.length;

    const slots = [];
    for (let time = openMins; time + durationMins <= closeMins; time += slotStep) {
      const slotStart = time;
      const slotEnd = time + durationMins;

      // Count conflicts in this window
      const conflictingBookings = existingAppointments.filter((b) => {
        const bStart = timeToMins(b.startTime);
        const bEnd = timeToMins(b.endTime);
        return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
      });

      const isAvailable = (stylistId && stylistId !== 'any')
        ? conflictingBookings.length === 0
        : conflictingBookings.length < totalStylistCapacity;

      slots.push({
        time: minsToTime(slotStart),
        available: isAvailable,
        availableStylistsCount: Math.max(0, totalStylistCapacity - conflictingBookings.length),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        date,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};
