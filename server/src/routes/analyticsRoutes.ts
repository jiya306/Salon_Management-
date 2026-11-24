import { Router } from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getAppointmentAnalytics,
  getCustomerAnalytics,
  getServiceAnalytics,
  getStaffAnalytics,
} from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticateToken, getDashboardStats);
router.get('/revenue', authenticateToken, getRevenueAnalytics);
router.get('/appointments', authenticateToken, getAppointmentAnalytics);
router.get('/customers', authenticateToken, getCustomerAnalytics);
router.get('/services', authenticateToken, getServiceAnalytics);
router.get('/staff', authenticateToken, getStaffAnalytics);

export default router;
