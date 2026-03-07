/**
 * Shared types for NyumbaLink API
 */

export type UserRole = 'tenant' | 'buyer' | 'property_owner' | 'real_estate_company' | 'admin';

export type PropertyType = 'house' | 'land' | 'apartment' | 'commercial';

export type ListingIntent = 'rent' | 'buy' | 'both';

export type PurchaseStatus = 'pending' | 'contacted' | 'negotiating' | 'approved' | 'rejected' | 'completed';

export type RentalStatus = 'pending' | 'approved' | 'lease_signed' | 'active' | 'terminated';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Property {
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
  status: string;
  created_at: Date;
  updated_at: Date;
}
