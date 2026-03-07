/**
 * Auth controller - register, login, profile
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import * as UserModel from '../models/User';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, full_name, phone, role } = req.body;
  const result = await authService.register({
    email,
    password,
    full_name,
    phone,
    role: role || 'buyer',
  });
  res.status(201).json(result);
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const user = await UserModel.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    role: user.role,
  });
};
