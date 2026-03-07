/**
 * Admin routes - users, properties, approve listing, verify, dashboard
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import {
  listUsers,
  listAllProperties,
  approveListing,
  verifyProperty,
  dashboardStats,
} from '../controllers/adminController';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);
router.use(requireRoles('admin'));

router.get('/stats', dashboardStats);
router.get('/users', listUsers);
router.get('/properties', listAllProperties);
router.post(
  '/approve-listing',
  [body('property_id').isUUID()],
  validate,
  approveListing
);
router.post(
  '/verify-property',
  [body('property_id').isUUID(), body('verified').isBoolean()],
  validate,
  verifyProperty
);

export const adminRoutes = router;
