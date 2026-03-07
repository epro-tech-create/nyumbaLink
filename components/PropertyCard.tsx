'use client';

import Link from 'next/link';
import type { Property } from '@/services/api';

const TYPE_LABELS: Record<string, string> = {
  house: 'House',
  land: 'Land (Viwanja)',
  apartment: 'Apartment',
  commercial: 'Commercial',
};

export function PropertyCard({ p }: { p: Property }) {
  const imageUrl = Array.isArray(p.images) && p.images[0] ? p.images[0] : '/placeholder-property.jpg';
  const intentLabel = p.intent === 'both' ? 'Rent or Buy' : p.intent === 'rent' ? 'For Rent' : 'For Sale';

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-xl border border-amber-900/30 bg-amber-950/50 transition hover:border-amber-700/50 hover:shadow-lg hover:shadow-amber-900/20"
    >
      <div className="relative aspect-[4/3] bg-amber-900/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={p.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1c1917/78716c?text=Property';
          }}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <span className="rounded bg-amber-900/90 px-2 py-0.5 text-xs font-medium text-amber-200">
            {TYPE_LABELS[p.property_type] || p.property_type}
          </span>
          <span className="rounded bg-amber-800/90 px-2 py-0.5 text-xs text-amber-100">{intentLabel}</span>
          {p.verified_ownership && (
            <span className="rounded bg-emerald-800/90 px-2 py-0.5 text-xs font-medium text-emerald-200">
              Verified
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-amber-100 line-clamp-1 group-hover:text-amber-400">{p.title}</h3>
        <p className="mt-1 text-sm text-amber-200/70 line-clamp-2">{p.description}</p>
        <p className="mt-2 text-sm text-amber-300/80">
          {p.location_city}, {p.location_country}
        </p>
        <p className="mt-2 text-lg font-bold text-amber-400">
          {p.currency} {Number(p.price).toLocaleString()}
          {p.intent === 'rent' && '/mo'}
        </p>
      </div>
    </Link>
  );
}
