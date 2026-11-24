import { Router } from 'express';
import { getInvoices, getInvoiceById, createInvoice } from '../controllers/invoiceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getInvoices);
router.get('/:id', authenticateToken, getInvoiceById);
router.post('/', authenticateToken, createInvoice);

export default router;
