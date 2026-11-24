import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireRole('ADMIN', 'SALON_OWNER'), updateSettings);

export default router;
