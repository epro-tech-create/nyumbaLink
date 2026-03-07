/**
 * NyumbaLink API - African Real Estate Platform
 * Entry point for Express server
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRoutes } from './routes/auth';
import { propertyRoutes } from './routes/properties';
import { purchaseRoutes } from './routes/purchases';
import { rentalRoutes } from './routes/rentals';
import { paymentRoutes } from './routes/payments';
import { verificationRoutes } from './routes/verification';
import { adminRoutes } from './routes/admin';
import { notificationRoutes } from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NyumbaLink API', version: '1.0.0' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`NyumbaLink API running on http://localhost:${PORT}`);
});

export default app;
