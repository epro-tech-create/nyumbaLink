/**
 * Notification routes - send SMS (admin)
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import { sendSms } from '../controllers/notificationController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/sms',
  authenticate,
  requireRoles('admin'),
  [body('to').notEmpty().trim(), body('message').notEmpty().trim()],
  validate,
  sendSms
);

export const notificationRoutes = router;
