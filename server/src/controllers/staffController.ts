import { Request, Response, NextFunction } from 'express';
import { Staff, Appointment } from '../models/index.js';

export const getStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { specialization, activeOnly, role } = req.query;
    const query: any = {};

    if (activeOnly === 'true') {
      query.isActive = true;
    }
    if (specialization) {
      query.specialization = new RegExp(String(specialization), 'i');
    }
    if (role) {
      query.role = role;
    }

    const staffList = await Staff.find(query).sort({ rating: -1, experience: -1 });
    res.status(200).json({ success: true, data: staffList });
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await Staff.countDocuments();
    const employeeId = `STF-${String(count + 1).padStart(3, '0')}`;

    const staff = new Staff({
      ...req.body,
      employeeId: req.body.employeeId || employeeId,
    });

    await staff.save();
    res.status(201).json({ success: true, message: 'Staff member added successfully', data: staff });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Staff updated successfully', data: staff });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Staff member removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getStaffAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date } = req.query;
    const query: any = { stylist: req.params.id };
    if (date) {
      query.appointmentDate = date;
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'fullName phone email loyaltyTier')
      .populate('service', 'name category price duration')
      .sort({ appointmentDate: 1, startTime: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getStaffPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }

    const appointments = await Appointment.find({ stylist: req.params.id });
    const completed = appointments.filter((a) => a.status === 'Completed');
    const totalRevenue = completed.reduce((sum, a) => sum + (a.finalPrice || 0), 0);
    const commissionEarned = Math.round((totalRevenue * (staff.commission || 10)) / 100);

    res.status(200).json({
      success: true,
      data: {
        staff,
        totalAppointments: appointments.length,
        completedAppointments: completed.length,
        cancelledAppointments: appointments.filter((a) => a.status === 'Cancelled').length,
        totalRevenue,
        commissionEarned,
        rating: staff.rating,
        reviewCount: staff.reviewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
