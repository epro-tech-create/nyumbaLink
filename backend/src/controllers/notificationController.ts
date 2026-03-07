/**
 * Notification controller - send SMS (admin/test)
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as notificationService from '../services/notificationService';

export const sendSms = async (req: AuthRequest, res: Response): Promise<void> => {
  const { to, message } = req.body;
  const result = await notificationService.sendSms(to, message);
  res.json(result);
};
