'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { properties as propertiesApi, type Property } from '@/services/api';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [list, setList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params: Record<string, string | number | boolean | undefined> = {};
    searchParams.forEach((v, k) => {
      if (k === 'min_price' || k === 'max_price') params[k] = Number(v);
      else if (k === 'verified_only') params[k] = v === 'true';
      else params[k] = v;
    });
    propertiesApi
      .search(params)
      .then((res) => {
        setList(res.properties);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load properties'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-amber-400">Browse properties</h1>
      <p className="mt-2 text-stone-400">Houses, land (viwanja), apartments, and commercial — rent or buy.</p>
      <div className="mt-6">
        <SearchFilters />
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-red-300">
          {error}
        </div>
      )}
      {loading ? (
        <div className="mt-10 text-center text-stone-400">Loading...</div>
      ) : list.length === 0 ? (
        <div className="mt-10 text-center text-stone-400">No properties found. Try adjusting filters.</div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
