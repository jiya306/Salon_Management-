import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/index.js';

export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, activeOnly, search, popular } = req.query;
    const query: any = {};

    if (activeOnly === 'true') {
      query.isActive = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (popular === 'true') {
      query.popularStatus = true;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const services = await Service.find(query).sort({ popularStatus: -1, rating: -1, price: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    next(error);
  }
};
