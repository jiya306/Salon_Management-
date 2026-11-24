import { Router } from 'express';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public can get reviews for landing page, and submit a review
router.get('/', getReviews);
router.post('/', createReview);

router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;
