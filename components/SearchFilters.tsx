'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PROPERTY_TYPES = [
  { value: '', label: 'Any type' },
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land (Viwanja)' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
];

const INTENTS = [
  { value: '', label: 'Rent or Buy' },
  { value: 'rent', label: 'For Rent' },
  { value: 'buy', label: 'For Sale' },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    (['location_city', 'location_country', 'property_type', 'intent', 'min_price', 'max_price', 'verified_only'] as const).forEach((key) => {
      const v = formData.get(key);
      if (v && String(v).trim()) params.set(key, String(v).trim());
    });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 rounded-xl border border-amber-900/30 bg-amber-950/50 p-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">City</span>
        <input
          name="location_city"
          type="text"
          placeholder="e.g. Nairobi"
          defaultValue={searchParams.get('location_city') ?? ''}
          className="w-40 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 placeholder-amber-500 focus:border-amber-600 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">Country</span>
        <input
          name="location_country"
          type="text"
          placeholder="e.g. Kenya"
          defaultValue={searchParams.get('location_country') ?? ''}
          className="w-40 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 placeholder-amber-500 focus:border-amber-600 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">Type</span>
        <select
          name="property_type"
          defaultValue={searchParams.get('property_type') ?? ''}
          className="w-40 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 focus:border-amber-600 focus:outline-none"
        >
          {PROPERTY_TYPES.map((o) => (
            <option key={o.value || 'any'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">Intent</span>
        <select
          name="intent"
          defaultValue={searchParams.get('intent') ?? ''}
          className="w-36 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 focus:border-amber-600 focus:outline-none"
        >
          {INTENTS.map((o) => (
            <option key={o.value || 'any'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">Min price</span>
        <input
          name="min_price"
          type="number"
          min={0}
          placeholder="0"
          defaultValue={searchParams.get('min_price') ?? ''}
          className="w-28 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 placeholder-amber-500 focus:border-amber-600 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-amber-200">Max price</span>
        <input
          name="max_price"
          type="number"
          min={0}
          placeholder="Any"
          defaultValue={searchParams.get('max_price') ?? ''}
          className="w-28 rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-amber-100 placeholder-amber-500 focus:border-amber-600 focus:outline-none"
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          name="verified_only"
          type="checkbox"
          defaultChecked={searchParams.get('verified_only') === 'true'}
          className="h-4 w-4 rounded border-amber-700 text-amber-600 focus:ring-amber-500"
        />
        <span className="text-sm text-amber-200">Verified only</span>
      </label>
      <button
        type="submit"
        className="rounded bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-500"
      >
        Search
      </button>
    </form>
  );
}
