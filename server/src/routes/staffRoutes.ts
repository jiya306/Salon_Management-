import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffAppointments,
  getStaffPerformance,
} from '../controllers/staffController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public can view staff list for landing page and booking
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), createStaff);
router.put('/:id', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), updateStaff);
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), deleteStaff);

router.get('/:id/appointments', authenticateToken, getStaffAppointments);
router.get('/:id/performance', authenticateToken, getStaffPerformance);

export default router;
