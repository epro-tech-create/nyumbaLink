'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'property_owner', label: 'Property Owner' },
  { value: 'real_estate_company', label: 'Real Estate Company' },
];

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email, password, full_name, phone: phone || undefined, role });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-amber-400">Create account</h1>
      <p className="mt-2 text-stone-400">Join NyumbaLink to list, buy, or rent property.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Full name</span>
          <input
            type="text"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
            placeholder="Jane Doe"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Phone (for SMS)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
            placeholder="+254..."
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">I am a</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
            placeholder="Min 6 characters"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-600 py-2.5 font-medium text-white hover:bg-amber-500 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-400">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
