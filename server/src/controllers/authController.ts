import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Customer, Staff } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'salonflow_super_secure_jwt_secret_key_2026_beauty_excellence';

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const userRole = role && ['ADMIN', 'SALON_OWNER', 'RECEPTIONIST', 'STYLIST', 'CUSTOMER'].includes(role)
      ? role
      : 'CUSTOMER';

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      phone,
    });

    await user.save();

    // If registered as customer, auto create Customer document
    if (userRole === 'CUSTOMER') {
      const existingCust = await Customer.findOne({ email: email.toLowerCase() });
      if (!existingCust) {
        await Customer.create({
          user: user._id,
          fullName: name,
          email: email.toLowerCase(),
          phone: phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          registrationDate: new Date(),
          totalVisits: 0,
          totalSpending: 0,
          loyaltyPoints: 50, // Welcome bonus points!
          loyaltyTier: 'Bronze',
        });
      }
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    let customerData = null;
    let staffData = null;

    if (user.role === 'CUSTOMER') {
      customerData = await Customer.findOne({ $or: [{ user: user._id }, { email: user.email }] });
    } else if (user.role === 'STYLIST') {
      staffData = await Staff.findOne({ $or: [{ user: user._id }, { email: user.email }] });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        customerProfile: customerData,
        staffProfile: staffData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Simulate secure forgot password without leaking email existence
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    });
  } catch (error) {
    next(error);
  }
};
