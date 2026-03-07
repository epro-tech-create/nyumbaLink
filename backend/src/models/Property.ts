/**
 * Property model - listings CRUD and search
 */
import { query } from '../config/db';
import { PropertyType, ListingIntent } from '../types';

export interface PropertyRow {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  intent: ListingIntent;
  price: number;
  currency: string;
  location_address: string;
  location_city: string;
  location_country: string;
  images: string[];
  verified_ownership: boolean;
  verification_status: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyFilters {
  location_city?: string;
  location_country?: string;
  min_price?: number;
  max_price?: number;
  property_type?: PropertyType;
  intent?: ListingIntent;
  verified_only?: boolean;
  limit?: number;
  offset?: number;
}

export const create = async (data: {
  owner_id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  intent: ListingIntent;
  price: number;
  currency?: string;
  location_address: string;
  location_city: string;
  location_country: string;
  images?: string[];
}): Promise<PropertyRow> => {
  const result = await query(
    `INSERT INTO properties (owner_id, title, description, property_type, intent, price, currency, location_address, location_city, location_country, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.owner_id,
      data.title,
      data.description,
      data.property_type,
      data.intent,
      data.price,
      data.currency || 'USD',
      data.location_address,
      data.location_city,
      data.location_country,
      JSON.stringify(data.images || []),
    ]
  );
  return result.rows[0] as PropertyRow;
};

export const findById = async (id: string, activeOnly = false): Promise<PropertyRow | null> => {
  const sql = activeOnly
    ? 'SELECT * FROM properties WHERE id = $1 AND status = $2'
    : 'SELECT * FROM properties WHERE id = $1';
  const params = activeOnly ? [id, 'active'] : [id];
  const result = await query(sql, params);
  return (result.rows[0] as PropertyRow) || null;
};

export const search = async (filters: PropertyFilters): Promise<PropertyRow[]> => {
  const conditions: string[] = ["status = 'active'"];
  const params: unknown[] = [];
  let idx = 1;

  if (filters.location_city) {
    conditions.push(`LOWER(location_city) LIKE LOWER($${idx})`);
    params.push(`%${filters.location_city}%`);
    idx++;
  }
  if (filters.location_country) {
    conditions.push(`LOWER(location_country) LIKE LOWER($${idx})`);
    params.push(`%${filters.location_country}%`);
    idx++;
  }
  if (filters.min_price != null) {
    conditions.push(`price >= $${idx}`);
    params.push(filters.min_price);
    idx++;
  }
  if (filters.max_price != null) {
    conditions.push(`price <= $${idx}`);
    params.push(filters.max_price);
    idx++;
  }
  if (filters.property_type) {
    conditions.push(`property_type = $${idx}`);
    params.push(filters.property_type);
    idx++;
  }
  if (filters.intent) {
    conditions.push(`(intent = $${idx} OR intent = 'both')`);
    params.push(filters.intent);
    idx++;
  }
  if (filters.verified_only) {
    conditions.push('verified_ownership = true');
  }

  const limit = Math.min(filters.limit ?? 20, 100);
  const offset = filters.offset ?? 0;
  params.push(limit, offset);
  const sql = `SELECT * FROM properties WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
  const result = await query(sql, params);
  return result.rows as PropertyRow[];
};

export const findByOwner = async (ownerId: string): Promise<PropertyRow[]> => {
  const result = await query('SELECT * FROM properties WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
  return result.rows as PropertyRow[];
};

export const update = async (id: string, ownerId: string, data: Partial<PropertyRow>): Promise<PropertyRow | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const allowed = ['title', 'description', 'price', 'currency', 'location_address', 'location_city', 'location_country', 'images', 'status', 'intent'];
  for (const [k, v] of Object.entries(data)) {
    if (allowed.includes(k) && v !== undefined) {
      if (k === 'images') {
        fields.push(`images = $${i}`);
        values.push(JSON.stringify(v));
      } else {
        fields.push(`${k} = $${i}`);
        values.push(v);
      }
      i++;
    }
  }
  if (fields.length === 0) return findById(id);
  fields.push(`updated_at = NOW()`);
  values.push(id, ownerId);
  const result = await query(
    `UPDATE properties SET ${fields.join(', ')} WHERE id = $${i + 1} AND owner_id = $${i + 2} RETURNING *`,
    values
  );
  return (result.rows[0] as PropertyRow) || null;
};

export const setVerified = async (id: string, verified: boolean): Promise<PropertyRow | null> => {
  const result = await query(
    `UPDATE properties SET verified_ownership = $1, verification_status = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    [verified, verified ? 'verified' : 'rejected', id]
  );
  return (result.rows[0] as PropertyRow) || null;
};
