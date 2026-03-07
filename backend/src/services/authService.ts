/**
 * Authentication service - register, login, JWT
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../middleware/auth';
import * as UserModel from '../models/User';
import { UserRole } from '../types';

const SALT_ROUNDS = 10;

export const register = async (data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}) => {
  const existing = await UserModel.findByEmail(data.email);
  if (existing) throw new Error('Email already registered');

  const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await UserModel.create({
    email: data.email,
    password_hash,
    full_name: data.full_name,
    phone: data.phone,
    role: data.role,
  });
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
  return {
    user: { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, role: user.role },
    token,
  };
};

export const login = async (email: string, password: string) => {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new Error('Invalid email or password');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
  return {
    user: { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, role: user.role },
    token,
  };
};
