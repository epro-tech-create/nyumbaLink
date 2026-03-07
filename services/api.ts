/**
 * NyumbaLink API client - base URL and auth token
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nyumbalink_token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data as T;
}

export const auth = {
  register: (body: { email: string; password: string; full_name: string; phone?: string; role?: string }) =>
    api<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email: string, password: string) =>
    api<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => api<User>('/auth/me'),
};

export const properties = {
  search: (params: Record<string, string | number | boolean | undefined>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && v !== '' && q.set(k, String(v)));
    return api<{ properties: Property[] }>(`/properties?${q}`);
  },
  getById: (id: string) => api<Property>(`/properties/${id}`),
  create: (body: PropertyCreate) => api<Property>('/properties', { method: 'POST', body: JSON.stringify(body) }),
  myListings: () => api<{ properties: Property[] }>('/properties/my'),
};

export const purchases = {
  create: (property_id: string, message?: string) =>
    api<Purchase>('/purchases', { method: 'POST', body: JSON.stringify({ property_id, message }) }),
  my: () => api<{ purchases: Purchase[] }>('/purchases/my'),
};

export const rentals = {
  apply: (property_id: string, message?: string) =>
    api<RentalApplication>('/rentals/apply', { method: 'POST', body: JSON.stringify({ property_id, message }) }),
  my: () => api<{ rentals: Rental[] }>('/rentals/my'),
};

export const payments = {
  create: (body: PaymentCreate) => api<Payment>('/payments', { method: 'POST', body: JSON.stringify(body) }),
  my: () => api<{ payments: Payment[] }>('/payments/my'),
};

export const admin = {
  stats: () => api<{ total_users: number; active_listings: number; pending_approvals: number }>('/admin/stats'),
  users: () => api<{ users: User[] }>('/admin/users'),
  properties: () => api<{ properties: Property[] }>('/admin/properties'),
  approveListing: (property_id: string) =>
    api<Property>('/admin/approve-listing', { method: 'POST', body: JSON.stringify({ property_id }) }),
  verifyProperty: (property_id: string, verified: boolean) =>
    api<Property>('/admin/verify-property', { method: 'POST', body: JSON.stringify({ property_id, verified }) }),
};

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
}

export type PropertyType = 'house' | 'land' | 'apartment' | 'commercial';
export type ListingIntent = 'rent' | 'buy' | 'both';

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
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyCreate {
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
}

export interface Purchase {
  id: string;
  property_id: string;
  buyer_id: string;
  status: string;
  message?: string;
  created_at: string;
}

export interface RentalApplication {
  id: string;
  property_id: string;
  tenant_id: string;
  status: string;
  message?: string;
  created_at: string;
}

export interface Rental {
  id: string;
  property_id: string;
  tenant_id: string;
  status: string;
  monthly_rent: number;
  lease_start: string;
  lease_end: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_type: string;
  reference_type: string;
  reference_id: string;
  status: string;
  provider: string;
  created_at: string;
}

export interface PaymentCreate {
  amount: number;
  currency?: string;
  payment_type: 'purchase' | 'rent';
  reference_type: string;
  reference_id: string;
  provider?: string;
}
