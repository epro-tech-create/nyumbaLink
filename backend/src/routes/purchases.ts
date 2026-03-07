/**
 * Purchase routes - create request, my purchases, by property, update status
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRoles } from '../middleware/auth';
import { create, getMine, getByProperty, updateStatus } from '../controllers/purchaseController';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRoles('buyer', 'admin'),
  [body('property_id').isUUID(), body('message').optional().trim()],
  validate,
  create
);
router.get('/my', getMine);
router.get('/property/:propertyId', getByProperty);
router.patch('/:id', [body('status').isIn(['pending', 'contacted', 'negotiating', 'approved', 'rejected', 'completed'])], validate, updateStatus);

export const purchaseRoutes = router;
