/**
 * Admin controller - users, properties, approve listing, verification
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/db';
import * as PropertyModel from '../models/Property';
import * as notificationService from '../services/notificationService';
import * as UserModel from '../models/User';

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await query(
    'SELECT id, email, full_name, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT 100'
  );
  res.json({ users: result.rows });
};

export const listAllProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await query('SELECT * FROM properties ORDER BY created_at DESC');
  res.json({ properties: result.rows });
};

export const approveListing = async (req: AuthRequest, res: Response): Promise<void> => {
  const { property_id } = req.body;
  const result = await query('SELECT * FROM properties WHERE id = $1', [property_id]);
  const property = result.rows[0];
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  await query("UPDATE properties SET status = 'active', updated_at = NOW() WHERE id = $1", [property_id]);
  const owner = await UserModel.findById(property.owner_id);
  if (owner?.phone) {
    await notificationService.notifyListingApproval(owner.phone, property.title);
  }
  const updatedResult = await query('SELECT * FROM properties WHERE id = $1', [property_id]);
  res.json(updatedResult.rows[0]);
};

export const verifyProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const { property_id, verified } = req.body;
  const updated = await PropertyModel.setVerified(property_id, !!verified);
  if (!updated) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json(updated);
};

export const dashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const usersResult = await query('SELECT COUNT(*) AS count FROM users');
  const propertiesResult = await query('SELECT COUNT(*) AS count FROM properties WHERE status = $1', ['active']);
  const pendingResult = await query("SELECT COUNT(*) AS count FROM properties WHERE status = 'pending'");
  res.json({
    total_users: parseInt(usersResult.rows[0].count, 10),
    active_listings: parseInt(propertiesResult.rows[0].count, 10),
    pending_approvals: parseInt(pendingResult.rows[0].count, 10),
  });
};
