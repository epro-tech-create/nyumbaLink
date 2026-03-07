/**
 * Verification controller - admin verifies property ownership via land registry placeholder
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as PropertyModel from '../models/Property';

// Placeholder: in production, call government land registry API
const verifyWithLandRegistry = async (_propertyId: string, _registryRef: string): Promise<boolean> => {
  // Simulate API call - replace with real integration
  return true;
};

export const verifyOwnership = async (req: AuthRequest, res: Response): Promise<void> => {
  const { property_id, registry_reference } = req.body;
  const property = await PropertyModel.findById(property_id);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  const verified = await verifyWithLandRegistry(property_id, registry_reference || '');
  const updated = await PropertyModel.setVerified(property_id, verified);
  res.json(updated);
};

export const getVerificationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await PropertyModel.findById(req.params.propertyId);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({
    property_id: property.id,
    verified_ownership: property.verified_ownership,
    verification_status: property.verification_status,
  });
};
