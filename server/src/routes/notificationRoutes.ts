import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getNotifications);
router.patch('/read-all', authenticateToken, markAllAsRead);
router.patch('/:id/read', authenticateToken, markAsRead);

export default router;
