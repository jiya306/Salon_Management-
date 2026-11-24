import { Request, Response, NextFunction } from 'express';
import { Promotion } from '../models/index.js';

export const getPromotions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { activeOnly } = req.query;
    const query: any = {};
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    const promotions = await Promotion.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: promotions });
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.body.code?.toUpperCase();
    const existing = await Promotion.findOne({ code });
    if (existing) {
      res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
      return;
    }

    const promotion = new Promotion({
      ...req.body,
      code,
    });
    await promotion.save();

    res.status(201).json({ success: true, message: 'Promotion created successfully', data: promotion });
  } catch (error) {
    next(error);
  }
};

export const updatePromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      res.status(404).json({ success: false, message: 'Promotion not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Promotion updated successfully', data: promotion });
  } catch (error) {
    next(error);
  }
};

export const deletePromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      res.status(404).json({ success: false, message: 'Promotion not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Promotion deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const validatePromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Promo code is required' });
      return;
    }

    const promo = await Promotion.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promo) {
      res.status(404).json({ success: false, message: 'Invalid or expired promotional code' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (today < promo.startDate || today > promo.endDate) {
      res.status(400).json({ success: false, message: 'This promotion is no longer active' });
      return;
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      res.status(400).json({ success: false, message: 'This coupon has reached its maximum usage limit' });
      return;
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (orderSubtotal < promo.minPurchase) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${promo.minPurchase} required to apply this coupon`,
      });
      return;
    }

    let discountAmount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((orderSubtotal * promo.discountValue) / 100);
      if (promo.maxDiscount && promo.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, promo.maxDiscount);
      }
    } else {
      discountAmount = promo.discountValue;
    }

    res.status(200).json({
      success: true,
      message: `Coupon '${promo.code}' applied successfully!`,
      data: {
        code: promo.code,
        title: promo.title,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        finalPrice: Math.max(0, orderSubtotal - discountAmount),
      },
    });
  } catch (error) {
    next(error);
  }
};
