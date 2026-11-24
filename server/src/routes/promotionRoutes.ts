import { Router } from 'express';
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
} from '../controllers/promotionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public can view active promotions on landing page and validate in booking wizard
router.get('/', getPromotions);
router.post('/validate', validatePromotion);

router.post('/', authenticateToken, createPromotion);
router.put('/:id', authenticateToken, updatePromotion);
router.delete('/:id', authenticateToken, deletePromotion);

export default router;
