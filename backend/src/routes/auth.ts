/**
 * Auth routes - register, login, me
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import { register, login, me } from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
    body('phone').optional().trim(),
    body('role').optional().isIn(['tenant', 'buyer', 'property_owner', 'real_estate_company', 'admin']),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  login
);

router.get('/me', authenticate, me);

export const authRoutes = router;
