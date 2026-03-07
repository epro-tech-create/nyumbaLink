/**
 * Purchase request model - buy flow
 */
import { query } from '../config/db';
import { PurchaseStatus } from '../types';

export interface PurchaseRow {
  id: string;
  property_id: string;
  buyer_id: string;
  status: PurchaseStatus;
  message: string | null;
  created_at: Date;
  updated_at: Date;
}

export const create = async (propertyId: string, buyerId: string, message?: string): Promise<PurchaseRow> => {
  const result = await query(
    `INSERT INTO purchases (property_id, buyer_id, status, message) VALUES ($1, $2, 'pending', $3) RETURNING *`,
    [propertyId, buyerId, message || null]
  );
  return result.rows[0] as PurchaseRow;
};

export const findById = async (id: string): Promise<PurchaseRow | null> => {
  const result = await query('SELECT * FROM purchases WHERE id = $1', [id]);
  return (result.rows[0] as PurchaseRow) || null;
};

export const findByProperty = async (propertyId: string): Promise<PurchaseRow[]> => {
  const result = await query('SELECT * FROM purchases WHERE property_id = $1 ORDER BY created_at DESC', [propertyId]);
  return result.rows as PurchaseRow[];
};

export const findByBuyer = async (buyerId: string): Promise<PurchaseRow[]> => {
  const result = await query('SELECT * FROM purchases WHERE buyer_id = $1 ORDER BY created_at DESC', [buyerId]);
  return result.rows as PurchaseRow[];
};

export const updateStatus = async (id: string, status: PurchaseStatus): Promise<PurchaseRow | null> => {
  const result = await query(
    'UPDATE purchases SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return (result.rows[0] as PurchaseRow) || null;
};
