import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public can read services for booking and landing page
router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), createService);
router.put('/:id', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), updateService);
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), deleteService);

export default router;
