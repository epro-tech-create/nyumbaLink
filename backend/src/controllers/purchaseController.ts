/**
 * Purchase controller - submit request, list, update status
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as PurchaseModel from '../models/Purchase';
import * as PropertyModel from '../models/Property';
import { PurchaseStatus } from '../types';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const { property_id, message } = req.body;
  const property = await PropertyModel.findById(property_id, true);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  const purchase = await PurchaseModel.create(property_id, req.user.userId, message);
  res.status(201).json(purchase);
};

export const getMine = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const list = await PurchaseModel.findByBuyer(req.user.userId);
  res.json({ purchases: list });
};

export const getByProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await PropertyModel.findById(req.params.propertyId);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  if (req.user?.userId !== property.owner_id) {
    res.status(403).json({ error: 'Only property owner can view purchase requests' });
    return;
  }
  const list = await PurchaseModel.findByProperty(req.params.propertyId);
  res.json({ purchases: list });
};

export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const purchase = await PurchaseModel.findById(req.params.id);
  if (!purchase) {
    res.status(404).json({ error: 'Purchase request not found' });
    return;
  }
  const property = await PropertyModel.findById(purchase.property_id);
  if (!property || property.owner_id !== req.user?.userId) {
    res.status(403).json({ error: 'Only property owner can update status' });
    return;
  }
  const status = req.body.status as PurchaseStatus;
  const valid: PurchaseStatus[] = ['pending', 'contacted', 'negotiating', 'approved', 'rejected', 'completed'];
  if (!valid.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const updated = await PurchaseModel.updateStatus(req.params.id, status);
  res.json(updated);
};
