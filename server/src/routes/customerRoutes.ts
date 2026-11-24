import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAppointments,
  getCustomerPayments,
  getCustomerLoyalty,
} from '../controllers/customerController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getCustomers);
router.get('/:id', authenticateToken, getCustomerById);
router.post('/', authenticateToken, createCustomer);
router.put('/:id', authenticateToken, updateCustomer);
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), deleteCustomer);

router.get('/:id/appointments', authenticateToken, getCustomerAppointments);
router.get('/:id/payments', authenticateToken, getCustomerPayments);
router.get('/:id/loyalty', authenticateToken, getCustomerLoyalty);

export default router;
