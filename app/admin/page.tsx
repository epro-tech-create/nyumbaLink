'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { admin as adminApi } from '@/services/api';
import type { Property, User } from '@/services/api';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<{ total_users: number; active_listings: number; pending_approvals: number } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState<'approve' | 'verify' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    Promise.all([adminApi.stats(), adminApi.users(), adminApi.properties()])
      .then(([s, u, p]) => {
        setStats(s);
        setUsers(u.users);
        setProperties(p.properties);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (user && user.role !== 'admin') router.push('/dashboard');
  }, [user, router]);

  const handleApprove = async (property_id: string) => {
    try {
      await adminApi.approveListing(property_id);
      setProperties((prev) => prev.map((p) => (p.id === property_id ? { ...p, status: 'active' } : p)));
      setStats((s) => (s ? { ...s, pending_approvals: Math.max(0, s.pending_approvals - 1), active_listings: s.active_listings + 1 } : null));
      setAction(null);
      setSelectedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleVerify = async (property_id: string, verified: boolean) => {
    try {
      await adminApi.verifyProperty(property_id, verified);
      setProperties((prev) => prev.map((p) => (p.id === property_id ? { ...p, verified_ownership: verified } : p)));
      setAction(null);
      setSelectedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">Please log in.</p>
        <Link href="/login" className="mt-4 inline-block text-amber-400 hover:underline">Log in</Link>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">Admin access required.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-amber-400 hover:underline">Dashboard</Link>
      </div>
    );
  }

  if (loading) return <div className="py-12 text-center text-stone-400">Loading...</div>;
  if (error) return <div className="py-12 text-center text-red-400">{error}</div>;

  const pendingListings = properties.filter((p) => p.status === 'pending');

  return (
    <div>
      <h1 className="text-2xl font-bold text-amber-400">Admin dashboard</h1>
      <p className="mt-2 text-stone-400">Manage users, listings, and verification.</p>

      {stats && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/50 p-6">
            <p className="text-sm text-stone-400">Total users</p>
            <p className="text-2xl font-bold text-amber-400">{stats.total_users}</p>
          </div>
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/50 p-6">
            <p className="text-sm text-stone-400">Active listings</p>
            <p className="text-2xl font-bold text-amber-400">{stats.active_listings}</p>
          </div>
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/50 p-6">
            <p className="text-sm text-stone-400">Pending approvals</p>
            <p className="text-2xl font-bold text-amber-400">{stats.pending_approvals}</p>
          </div>
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-amber-200">Pending listing approvals</h2>
        {pendingListings.length === 0 ? (
          <p className="mt-4 text-stone-500">No pending listings.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {pendingListings.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-amber-900/30 bg-amber-950/30 px-4 py-3">
                <div>
                  <Link href={`/properties/${p.id}`} className="font-medium text-amber-300 hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-sm text-stone-500">{p.location_city}, {p.location_country}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApprove(p.id)}
                  className="rounded bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-500"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-amber-200">All properties (verify ownership)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-amber-800/50">
                <th className="py-2 font-medium text-amber-200">Title</th>
                <th className="py-2 font-medium text-amber-200">Location</th>
                <th className="py-2 font-medium text-amber-200">Status</th>
                <th className="py-2 font-medium text-amber-200">Verified</th>
                <th className="py-2 font-medium text-amber-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-amber-900/30">
                  <td className="py-3">
                    <Link href={`/properties/${p.id}`} className="text-amber-300 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3 text-stone-400">{p.location_city}, {p.location_country}</td>
                  <td className="py-3">{p.status || 'active'}</td>
                  <td className="py-3">{p.verified_ownership ? 'Yes' : 'No'}</td>
                  <td className="py-3">
                    {selectedId === p.id && action === 'verify' ? (
                      <span className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleVerify(p.id, true)}
                          className="rounded bg-emerald-700 px-2 py-1 text-xs text-white hover:bg-emerald-600"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerify(p.id, false)}
                          className="rounded bg-red-900/80 px-2 py-1 text-xs text-red-200 hover:bg-red-800/80"
                        >
                          Reject
                        </button>
                        <button type="button" onClick={() => { setAction(null); setSelectedId(null); }} className="text-stone-500">Cancel</button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setAction('verify'); setSelectedId(p.id); }}
                        className="text-amber-400 hover:underline"
                      >
                        Verify ownership
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-amber-200">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-amber-800/50">
                <th className="py-2 font-medium text-amber-200">Name</th>
                <th className="py-2 font-medium text-amber-200">Email</th>
                <th className="py-2 font-medium text-amber-200">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-amber-900/30">
                  <td className="py-3 text-stone-300">{u.full_name}</td>
                  <td className="py-3 text-stone-400">{u.email}</td>
                  <td className="py-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
