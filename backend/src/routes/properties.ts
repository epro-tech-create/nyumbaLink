/**
 * Property routes - search, get, create, update, my listings
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/auth';
import { search, getById, create, update, myListings } from '../controllers/propertyController';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', optionalAuth, search);
router.get('/my', authenticate, requireRoles('property_owner', 'real_estate_company', 'admin'), myListings);
router.get('/:id', getById);

router.post(
  '/',
  authenticate,
  requireRoles('property_owner', 'real_estate_company', 'admin'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('property_type').isIn(['house', 'land', 'apartment', 'commercial']),
    body('intent').isIn(['rent', 'buy', 'both']),
    body('price').isFloat({ min: 0 }),
    body('currency').optional().trim(),
    body('location_address').trim().notEmpty(),
    body('location_city').trim().notEmpty(),
    body('location_country').trim().notEmpty(),
    body('images').optional().isArray(),
  ],
  validate,
  create
);

router.patch('/:id', authenticate, update);

export const propertyRoutes = router;
