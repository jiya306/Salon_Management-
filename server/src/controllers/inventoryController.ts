import { Request, Response, NextFunction } from 'express';
import { Product, InventoryTransaction, Notification } from '../models/index.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, status, search, lowStock } = req.query;
    const query: any = {};

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (lowStock === 'true') {
      query.status = { $in: ['Low Stock', 'Out of Stock'] };
    }
    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [{ name: regex }, { sku: regex }, { supplier: regex }];
    }

    const products = await Product.find(query).sort({ stockQuantity: 1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, message: 'Product added to inventory', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const stockIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity, reason = 'Purchased Stock', performedBy = 'Admin' } = req.body;
    const qty = Number(quantity);

    if (!productId || isNaN(qty) || qty <= 0) {
      res.status(400).json({ success: false, message: 'Valid productId and positive quantity are required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const previousStock = product.stockQuantity;
    const newStock = previousStock + qty;
    product.stockQuantity = newStock;
    await product.save();

    const transaction = new InventoryTransaction({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      type: 'IN',
      quantity: qty,
      previousStock,
      newStock,
      reason,
      performedBy,
      date: new Date(),
    });
    await transaction.save();

    res.status(200).json({
      success: true,
      message: `Added ${qty} units to ${product.name}. New stock: ${newStock}`,
      data: { product, transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const stockOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity, reason = 'Used in Salon Service', performedBy = 'Staff' } = req.body;
    const qty = Number(quantity);

    if (!productId || isNaN(qty) || qty <= 0) {
      res.status(400).json({ success: false, message: 'Valid productId and positive quantity are required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (product.stockQuantity < qty) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock! Only ${product.stockQuantity} units available.`,
      });
      return;
    }

    const previousStock = product.stockQuantity;
    const newStock = previousStock - qty;
    product.stockQuantity = newStock;
    await product.save();

    const transaction = new InventoryTransaction({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      type: 'OUT',
      quantity: qty,
      previousStock,
      newStock,
      reason,
      performedBy,
      date: new Date(),
    });
    await transaction.save();

    if (newStock <= product.minStockLevel) {
      await Notification.create({
        title: 'Low Stock Alert',
        message: `${product.name} is low on stock (${newStock} units remaining). Minimum threshold is ${product.minStockLevel}.`,
        type: 'INVENTORY',
        link: '/dashboard/inventory',
      });
    }

    res.status(200).json({
      success: true,
      message: `Deducted ${qty} units from ${product.name}. Remaining: ${newStock}`,
      data: { product, transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, limit = '100' } = req.query;
    const query: any = {};
    if (productId) query.product = productId;

    const transactions = await InventoryTransaction.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit as string, 10));

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};
