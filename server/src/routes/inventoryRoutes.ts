import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getTransactions,
} from '../controllers/inventoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getProducts);
router.get('/transactions', authenticateToken, getTransactions);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);
router.post('/stock-in', authenticateToken, stockIn);
router.post('/stock-out', authenticateToken, stockOut);

export default router;
