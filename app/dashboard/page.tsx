'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { properties as propertiesApi, purchases, rentals } from '@/services/api';
import type { Property, Purchase, Rental } from '@/services/api';
import { PropertyCard } from '@/components/PropertyCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [myPurchases, setMyPurchases] = useState<Purchase[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      (user.role === 'property_owner' || user.role === 'real_estate_company' || user.role === 'admin')
        ? propertiesApi.myListings().then((r) => r.properties)
        : [],
      (user.role === 'buyer' || user.role === 'admin') ? purchases.my().then((r) => r.purchases) : [],
      (user.role === 'tenant' || user.role === 'admin') ? rentals.my().then((r) => r.rentals) : [],
    ])
      .then(([listings, purchasesList, rentalsList]) => {
        setMyListings(listings);
        setMyPurchases(purchasesList);
        setMyRentals(rentalsList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">Please log in to see your dashboard.</p>
        <Link href="/login" className="mt-4 inline-block text-amber-400 hover:underline">Log in</Link>
      </div>
    );
  }

  if (loading) return <div className="py-12 text-center text-stone-400">Loading...</div>;

  const canList = user.role === 'property_owner' || user.role === 'real_estate_company' || user.role === 'admin';

  return (
    <div>
      <h1 className="text-2xl font-bold text-amber-400">Dashboard</h1>
      <p className="mt-2 text-stone-400">Welcome, {user.full_name}. Here’s your activity.</p>

      {canList && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-200">My listings</h2>
            <Link href="/listings/new" className="text-sm text-amber-400 hover:underline">+ Add property</Link>
          </div>
          {myListings.length === 0 ? (
            <p className="mt-4 text-stone-500">You haven’t listed any properties yet.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.map((p) => (
                <div key={p.id} className="relative">
                  <PropertyCard p={p} />
                  <span className="absolute right-2 top-2 rounded bg-amber-900/90 px-2 py-0.5 text-xs text-amber-200">
                    {p.status || 'active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {(user.role === 'buyer' || user.role === 'admin') && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-amber-200">My purchase requests</h2>
          {myPurchases.length === 0 ? (
            <p className="mt-4 text-stone-500">No purchase requests yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {myPurchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg border border-amber-900/30 bg-amber-950/30 px-4 py-3">
                  <Link href={`/properties/${p.property_id}`} className="text-amber-300 hover:underline">
                    View property
                  </Link>
                  <span className="rounded bg-amber-800/80 px-2 py-0.5 text-sm text-amber-200">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(user.role === 'tenant' || user.role === 'admin') && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-amber-200">My rentals</h2>
          {myRentals.length === 0 ? (
            <p className="mt-4 text-stone-500">No active rentals.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {myRentals.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border border-amber-900/30 bg-amber-950/30 px-4 py-3">
                  <Link href={`/properties/${r.property_id}`} className="text-amber-300 hover:underline">
                    Property
                  </Link>
                  <span className="text-amber-200">
                    USD {Number(r.monthly_rent).toLocaleString()}/mo · {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
