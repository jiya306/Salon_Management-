import { Request, Response, NextFunction } from 'express';
import { SalonSettings } from '../models/index.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create(req.body);
    } else {
      settings = await SalonSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    next(error);
  }
};
