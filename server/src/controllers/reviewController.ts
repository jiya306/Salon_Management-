import { Request, Response, NextFunction } from 'express';
import { Review, Staff, Service, Appointment, Notification } from '../models/index.js';

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stylist, service, rating, limit = '50' } = req.query;
    const query: any = { isApproved: true };

    if (stylist) query.stylist = stylist;
    if (service) query.service = service;
    if (rating) query.rating = Number(rating);

    const reviews = await Review.find(query)
      .populate('stylist', 'fullName profileImage')
      .populate('service', 'name category')
      .sort({ date: -1 })
      .limit(parseInt(limit as string, 10));

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customerName, customerAvatar, appointmentId, serviceId, stylistId, rating, reviewText } = req.body;

    if (!rating || !reviewText || !customerName) {
      res.status(400).json({ success: false, message: 'Rating, review text, and customer name are required' });
      return;
    }

    let serviceName = 'Salon Service';
    if (serviceId) {
      const s = await Service.findById(serviceId);
      if (s) serviceName = s.name;
    }

    let stylistName = 'Salon Stylist';
    if (stylistId) {
      const st = await Staff.findById(stylistId);
      if (st) stylistName = st.fullName;
    }

    const review = new Review({
      customerName,
      customerAvatar,
      appointment: appointmentId,
      service: serviceId,
      serviceName,
      stylist: stylistId,
      stylistName,
      rating: Number(rating),
      reviewText,
      isApproved: true,
      date: new Date(),
    });

    await review.save();

    // Recalculate stylist rating
    if (stylistId) {
      const stylistReviews = await Review.find({ stylist: stylistId, isApproved: true });
      const avg = stylistReviews.reduce((sum, r) => sum + r.rating, 0) / stylistReviews.length;
      await Staff.findByIdAndUpdate(stylistId, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: stylistReviews.length,
      });
    }

    await Notification.create({
      title: 'New Customer Review',
      message: `${customerName} left a ${rating}-star review for ${stylistName}: "${reviewText.substring(0, 50)}..."`,
      type: 'REVIEW',
      link: '/dashboard',
    });

    res.status(201).json({ success: true, message: 'Thank you for your review!', data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
