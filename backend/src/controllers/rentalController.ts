/**
 * Rental controller - apply, list applications, create lease, my rentals
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as RentalModel from '../models/Rental';
import * as PropertyModel from '../models/Property';
import * as UserModel from '../models/User';
import * as notificationService from '../services/notificationService';

export const apply = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const { property_id, message } = req.body;
  const property = await PropertyModel.findById(property_id);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  const application = await RentalModel.createApplication(property_id, req.user.userId, message);
  const owner = await UserModel.findById(property.owner_id);
  if (owner?.phone) {
    const user = await UserModel.findById(req.user.userId);
    await notificationService.notifyRentalApplication(owner.phone, user?.full_name || 'A tenant', property.title);
  }
  res.status(201).json(application);
};

export const getApplicationsForProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await PropertyModel.findById(req.params.propertyId);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  if (property.owner_id !== req.user?.userId) {
    res.status(403).json({ error: 'Only property owner can view applications' });
    return;
  }
  const list = await RentalModel.findApplicationsByProperty(req.params.propertyId);
  res.json({ applications: list });
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const application = await RentalModel.findApplicationById(req.params.id);
  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  const property = await PropertyModel.findById(application.property_id);
  if (!property || property.owner_id !== req.user?.userId) {
    res.status(403).json({ error: 'Only property owner can update' });
    return;
  }
  const updated = await RentalModel.updateApplicationStatus(req.params.id, status);
  res.json(updated);
};

export const createLease = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const { property_id, tenant_id, monthly_rent, lease_start, lease_end } = req.body;
  const property = await PropertyModel.findById(property_id);
  if (!property || property.owner_id !== req.user.userId) {
    res.status(403).json({ error: 'Only property owner can create lease' });
    return;
  }
  const lease = await RentalModel.createLease({
    property_id,
    tenant_id,
    monthly_rent,
    lease_start: new Date(lease_start),
    lease_end: new Date(lease_end),
  });
  res.status(201).json(lease);
};

export const myRentals = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const list = await RentalModel.findRentalsByTenant(req.user.userId);
  res.json({ rentals: list });
};
