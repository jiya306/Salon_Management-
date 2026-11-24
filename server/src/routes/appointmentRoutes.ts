import { Router } from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateStatus,
  getAvailability,
} from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Availability check for customer booking wizard
router.get('/availability', getAvailability);

// Public can book appointment through wizard (no login mandatory, or logged in)
router.post('/', createAppointment);

// Authenticated management
router.get('/', authenticateToken, getAppointments);
router.get('/:id', authenticateToken, getAppointmentById);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);
router.patch('/:id/status', authenticateToken, updateStatus);

export default router;
