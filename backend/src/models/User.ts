/**
 * User model - CRUD and auth helpers
 */
import { query } from '../config/db';
import { UserRole } from '../types';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export const findById = async (id: string): Promise<UserRow | null> => {
  const result = await query(
    'SELECT id, email, password_hash, full_name, phone, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return (result.rows[0] as UserRow) || null;
};

export const findByEmail = async (email: string): Promise<UserRow | null> => {
  const result = await query(
    'SELECT id, email, password_hash, full_name, phone, role, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return (result.rows[0] as UserRow) || null;
};

export const create = async (data: {
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}): Promise<UserRow> => {
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, password_hash, full_name, phone, role, created_at, updated_at`,
    [data.email, data.password_hash, data.full_name, data.phone || null, data.role]
  );
  return result.rows[0] as UserRow;
};

export const updateProfile = async (id: string, data: { full_name?: string; phone?: string }): Promise<UserRow | null> => {
  const result = await query(
    `UPDATE users SET full_name = COALESCE($2, full_name), phone = COALESCE($3, phone), updated_at = NOW()
     WHERE id = $1 RETURNING id, email, password_hash, full_name, phone, role, created_at, updated_at`,
    [id, data.full_name, data.phone]
  );
  return (result.rows[0] as UserRow) || null;
};
