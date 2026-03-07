/**
 * Verification routes - admin verify ownership, get status
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import { verifyOwnership, getVerificationStatus } from '../controllers/verificationController';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/property/:propertyId', getVerificationStatus);

router.post(
  '/verify',
  authenticate,
  requireRoles('admin'),
  [body('property_id').isUUID(), body('registry_reference').optional().trim()],
  validate,
  verifyOwnership
);

export const verificationRoutes = router;
