/**
 * Rental routes - apply, applications, create lease, my rentals
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import {
  apply,
  getApplicationsForProperty,
  updateApplicationStatus,
  createLease,
  myRentals,
} from '../controllers/rentalController';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/apply',
  requireRoles('tenant', 'admin'),
  [body('property_id').isUUID(), body('message').optional().trim()],
  validate,
  apply
);
router.get('/my', myRentals);
router.get('/applications/property/:propertyId', getApplicationsForProperty);
router.patch('/applications/:id', [body('status').isIn(['pending', 'approved', 'rejected'])], validate, updateApplicationStatus);
router.post(
  '/lease',
  requireRoles('property_owner', 'real_estate_company', 'admin'),
  [
    body('property_id').isUUID(),
    body('tenant_id').isUUID(),
    body('monthly_rent').isFloat({ min: 0 }),
    body('lease_start').isISO8601(),
    body('lease_end').isISO8601(),
  ],
  validate,
  createLease
);

export const rentalRoutes = router;
