/**
 * Payment routes - create payment, my payments, get by id
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { create, myPayments, getById } from '../controllers/paymentController';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('amount').isFloat({ min: 0 }),
    body('currency').optional().trim(),
    body('payment_type').isIn(['purchase', 'rent']),
    body('reference_type').isIn(['purchase', 'rental']),
    body('reference_id').notEmpty(),
    body('provider').optional().isIn(['placeholder', 'mobile_money', 'bank']),
  ],
  validate,
  create
);
router.get('/my', myPayments);
router.get('/:id', getById);

export const paymentRoutes = router;
