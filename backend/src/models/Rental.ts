/**
 * Rental / lease model - rent flow
 */
import { query } from '../config/db';
import { RentalStatus } from '../types';

export interface RentalRow {
  id: string;
  property_id: string;
  tenant_id: string;
  status: RentalStatus;
  monthly_rent: number;
  lease_start: Date;
  lease_end: Date;
  created_at: Date;
  updated_at: Date;
}

export interface RentalApplicationRow {
  id: string;
  property_id: string;
  tenant_id: string;
  status: string;
  message: string | null;
  created_at: Date;
  updated_at: Date;
}

export const createApplication = async (propertyId: string, tenantId: string, message?: string): Promise<RentalApplicationRow> => {
  const result = await query(
    `INSERT INTO rental_applications (property_id, tenant_id, status, message) VALUES ($1, $2, 'pending', $3) RETURNING *`,
    [propertyId, tenantId, message || null]
  );
  return result.rows[0] as RentalApplicationRow;
};

export const createLease = async (data: {
  property_id: string;
  tenant_id: string;
  monthly_rent: number;
  lease_start: Date;
  lease_end: Date;
}): Promise<RentalRow> => {
  const result = await query(
    `INSERT INTO rentals (property_id, tenant_id, status, monthly_rent, lease_start, lease_end)
     VALUES ($1, $2, 'active', $3, $4, $5) RETURNING *`,
    [data.property_id, data.tenant_id, data.monthly_rent, data.lease_start, data.lease_end]
  );
  return result.rows[0] as RentalRow;
};

export const findApplicationById = async (id: string): Promise<RentalApplicationRow | null> => {
  const result = await query('SELECT * FROM rental_applications WHERE id = $1', [id]);
  return (result.rows[0] as RentalApplicationRow) || null;
};

export const findRentalById = async (id: string): Promise<RentalRow | null> => {
  const result = await query('SELECT * FROM rentals WHERE id = $1', [id]);
  return (result.rows[0] as RentalRow) || null;
};

export const findApplicationsByProperty = async (propertyId: string): Promise<RentalApplicationRow[]> => {
  const result = await query('SELECT * FROM rental_applications WHERE property_id = $1 ORDER BY created_at DESC', [propertyId]);
  return result.rows as RentalApplicationRow[];
};

export const findRentalsByTenant = async (tenantId: string): Promise<RentalRow[]> => {
  const result = await query('SELECT * FROM rentals WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
  return result.rows as RentalRow[];
};

export const updateRentalStatus = async (id: string, status: RentalStatus): Promise<RentalRow | null> => {
  const result = await query(
    'UPDATE rentals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return (result.rows[0] as RentalRow) || null;
};

export const updateApplicationStatus = async (id: string, status: string): Promise<RentalApplicationRow | null> => {
  const result = await query(
    'UPDATE rental_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return (result.rows[0] as RentalApplicationRow) || null;
};
