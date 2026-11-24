import { Router } from 'express';
import { getPayments, getPaymentById, createPayment } from '../controllers/paymentController.js';
import { getInvoices, getInvoiceById, createInvoice } from '../controllers/invoiceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getPayments);
router.get('/:id', authenticateToken, getPaymentById);
router.post('/', authenticateToken, createPayment);

export default router;
