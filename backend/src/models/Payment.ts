/**
 * Payment model - purchases and rent payments
 */
import { query } from '../config/db';
import { PaymentStatus } from '../types';

export type PaymentType = 'purchase' | 'rent';

export interface PaymentRow {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  reference_type: string; // 'purchase' | 'rental'
  reference_id: string;
  status: PaymentStatus;
  provider: string; // 'mobile_money' | 'bank' | 'placeholder'
  provider_reference: string | null;
  created_at: Date;
  updated_at: Date;
}

export const create = async (data: {
  user_id: string;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  reference_type: string;
  reference_id: string;
  provider?: string;
  provider_reference?: string;
}): Promise<PaymentRow> => {
  const result = await query(
    `INSERT INTO payments (user_id, amount, currency, payment_type, reference_type, reference_id, status, provider, provider_reference)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8) RETURNING *`,
    [
      data.user_id,
      data.amount,
      data.currency,
      data.payment_type,
      data.reference_type,
      data.reference_id,
      data.provider || 'placeholder',
      data.provider_reference || null,
    ]
  );
  return result.rows[0] as PaymentRow;
};

export const findById = async (id: string): Promise<PaymentRow | null> => {
  const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
  return (result.rows[0] as PaymentRow) || null;
};

export const findByUser = async (userId: string): Promise<PaymentRow[]> => {
  const result = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows as PaymentRow[];
};

export const updateStatus = async (id: string, status: PaymentStatus, providerRef?: string): Promise<PaymentRow | null> => {
  const result = await query(
    'UPDATE payments SET status = $1, provider_reference = COALESCE($2, provider_reference), updated_at = NOW() WHERE id = $3 RETURNING *',
    [status, providerRef, id]
  );
  return (result.rows[0] as PaymentRow) || null;
};
