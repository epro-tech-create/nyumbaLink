/**
 * Payment controller - init payment, webhook placeholder, my payments
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as PaymentModel from '../models/Payment';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const { amount, currency, payment_type, reference_type, reference_id, provider } = req.body;
  const payment = await PaymentModel.create({
    user_id: req.user.userId,
    amount,
    currency: currency || 'USD',
    payment_type,
    reference_type,
    reference_id,
    provider: provider || 'placeholder',
  });
  res.status(201).json({
    ...payment,
    message: 'Use placeholder provider for testing. Integrate mobile_money or bank in production.',
  });
};

export const myPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const list = await PaymentModel.findByUser(req.user.userId);
  res.json({ payments: list });
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  const payment = await PaymentModel.findById(req.params.id);
  if (!payment) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }
  if (payment.user_id !== req.user?.userId) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  res.json(payment);
};
