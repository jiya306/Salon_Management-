import { Request, Response, NextFunction } from 'express';
import { Appointment, Customer, Staff, Service, Payment, Product } from '../models/index.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = `${today.substring(0, 7)}-01`;

    const [
      todayAppointments,
      totalCustomers,
      activeStaffCount,
      allAppointments,
      allPayments,
      lowStockProducts,
      recentAppointments,
      recentCustomers,
    ] = await Promise.all([
      Appointment.find({ appointmentDate: today }),
      Customer.countDocuments(),
      Staff.countDocuments({ isActive: true }),
      Appointment.find().select('status appointmentDate finalPrice price serviceName stylistName'),
      Payment.find().select('amount paymentMethod paidAt paymentStatus'),
      Product.find({ status: { $in: ['Low Stock', 'Out of Stock'] } }).limit(5),
      Appointment.find().sort({ createdAt: -1 }).limit(6).populate('stylist', 'fullName').populate('service', 'name price'),
      Customer.find().sort({ registrationDate: -1 }).limit(6),
    ]);

    // Today's appointments breakdown
    const pendingAppointments = todayAppointments.filter((a) => a.status === 'Pending').length;
    const completedAppointments = todayAppointments.filter((a) => a.status === 'Completed').length;
    const cancelledAppointments = todayAppointments.filter((a) => a.status === 'Cancelled').length;

    // Today's revenue
    const todayRevenue = allPayments
      .filter((p) => p.paidAt && p.paidAt.toISOString().split('T')[0] === today && p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Monthly revenue
    const monthlyRevenue = allPayments
      .filter((p) => p.paidAt && p.paidAt.toISOString().split('T')[0] >= firstDayOfMonth && p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Monthly chart data (last 7 days)
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const revenueChart = last7Days.map((dayStr) => {
      const dayPayments = allPayments.filter(
        (p) => p.paidAt && p.paidAt.toISOString().split('T')[0] === dayStr && p.paymentStatus === 'Paid'
      );
      const dayAppointments = allAppointments.filter((a) => a.appointmentDate === dayStr);
      const dayName = new Date(dayStr).toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dayStr,
        day: dayName,
        revenue: dayPayments.reduce((sum, p) => sum + p.amount, 0),
        appointments: dayAppointments.length,
        completed: dayAppointments.filter((a) => a.status === 'Completed').length,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        cards: {
          todayAppointmentsCount: todayAppointments.length,
          totalCustomers,
          todayRevenue,
          monthlyRevenue,
          activeStaffCount,
          pendingAppointments,
          completedAppointments,
          cancelledAppointments,
        },
        revenueChart,
        lowStockProducts,
        recentAppointments,
        recentCustomers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ paymentStatus: 'Paid' });

    // Method breakdown
    const methodCounts: Record<string, number> = { UPI: 0, Card: 0, Cash: 0, Online: 0 };
    payments.forEach((p) => {
      methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + p.amount;
    });

    const methodData = Object.entries(methodCounts).map(([method, amount]) => ({
      name: method,
      value: amount,
    }));

    // Monthly aggregate for current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((m, index) => {
      const filtered = payments.filter((p) => p.paidAt && new Date(p.paidAt).getMonth() === index);
      return {
        month: m,
        revenue: filtered.reduce((sum, p) => sum + p.amount, 0),
        transactions: filtered.length,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        methodBreakdown: methodData,
        monthlyRevenue: monthlyData,
        totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointments = await Appointment.find();

    const statusCounts: Record<string, number> = {};
    appointments.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    res.status(200).json({
      success: true,
      data: {
        total: appointments.length,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customers = await Customer.find().sort({ totalSpending: -1 });

    const tiers = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
    customers.forEach((c) => {
      tiers[c.loyaltyTier] = (tiers[c.loyaltyTier] || 0) + 1;
    });

    const tierBreakdown = Object.entries(tiers).map(([tier, count]) => ({
      tier,
      count,
    }));

    const totalSpending = customers.reduce((sum, c) => sum + c.totalSpending, 0);
    const avgSpending = customers.length > 0 ? Math.round(totalSpending / customers.length) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers: customers.length,
        avgSpending,
        tierBreakdown,
        topCustomers: customers.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointments = await Appointment.find({ status: { $ne: 'Cancelled' } });
    const serviceCounts: Record<string, { count: number; revenue: number }> = {};

    appointments.forEach((a) => {
      if (!serviceCounts[a.serviceName]) {
        serviceCounts[a.serviceName] = { count: 0, revenue: 0 };
      }
      serviceCounts[a.serviceName].count += 1;
      serviceCounts[a.serviceName].revenue += a.finalPrice || 0;
    });

    const popularServices = Object.entries(serviceCounts)
      .map(([name, stat]) => ({
        name,
        bookings: stat.count,
        revenue: stat.revenue,
      }))
      .sort((a, b) => b.bookings - a.bookings);

    res.status(200).json({
      success: true,
      data: {
        popularServices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staffMembers = await Staff.find({ isActive: true });
    const appointments = await Appointment.find();

    const staffPerformance = staffMembers.map((staff) => {
      const staffApts = appointments.filter((a) => String(a.stylist) === String(staff._id));
      const completed = staffApts.filter((a) => a.status === 'Completed');
      const revenue = completed.reduce((sum, a) => sum + (a.finalPrice || 0), 0);

      return {
        id: staff._id,
        name: staff.fullName,
        role: staff.role,
        rating: staff.rating,
        totalBookings: staffApts.length,
        completedBookings: completed.length,
        revenue,
        commission: Math.round((revenue * (staff.commission || 10)) / 100),
      };
    });

    res.status(200).json({
      success: true,
      data: staffPerformance.sort((a, b) => b.revenue - a.revenue),
    });
  } catch (error) {
    next(error);
  }
};
