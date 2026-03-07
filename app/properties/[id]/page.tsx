'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { properties as propertiesApi, purchases, rentals, type Property } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const TYPE_LABELS: Record<string, string> = {
  house: 'House',
  land: 'Land (Viwanja)',
  apartment: 'Apartment',
  commercial: 'Commercial',
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState<'buy' | 'rent' | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    propertiesApi
      .getById(id)
      .then(setProperty)
      .catch((err) => setError(err instanceof Error ? err.message : 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchaseRequest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      await purchases.create(id, message || undefined);
      setAction(null);
      setMessage('');
      alert('Purchase request submitted. The owner will contact you.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRentalApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      await rentals.apply(id, message || undefined);
      setAction(null);
      setMessage('');
      alert('Rental application submitted. The owner will review.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-stone-400">Loading...</div>;
  if (error || !property) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-400">{error || 'Property not found'}</p>
        <Link href="/properties" className="mt-4 inline-block text-amber-400 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const intentRent = property.intent === 'rent' || property.intent === 'both';
  const intentBuy = property.intent === 'buy' || property.intent === 'both';
  const imageUrl = Array.isArray(property.images) && property.images[0] ? property.images[0] : 'https://placehold.co/800x400/1c1917/78716c?text=Property';

  return (
    <div className="max-w-4xl">
      <Link href="/properties" className="text-sm text-amber-400 hover:underline">
        ← Back to listings
      </Link>
      <div className="mt-6 overflow-hidden rounded-xl border border-amber-900/30 bg-amber-950/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={property.title}
          className="h-80 w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/1c1917/78716c?text=Property';
          }}
        />
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-amber-800/80 px-2 py-0.5 text-sm text-amber-200">
              {TYPE_LABELS[property.property_type] || property.property_type}
            </span>
            {property.intent === 'both' && <span className="rounded bg-amber-800/80 px-2 py-0.5 text-sm text-amber-200">Rent or Buy</span>}
            {property.intent === 'rent' && <span className="rounded bg-amber-800/80 px-2 py-0.5 text-sm text-amber-200">For Rent</span>}
            {property.intent === 'buy' && <span className="rounded bg-amber-800/80 px-2 py-0.5 text-sm text-amber-200">For Sale</span>}
            {property.verified_ownership && (
              <span className="rounded bg-emerald-800/80 px-2 py-0.5 text-sm font-medium text-emerald-200">Verified ownership</span>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-amber-100">{property.title}</h1>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {property.currency} {Number(property.price).toLocaleString()}
            {property.intent === 'rent' && ' / month'}
          </p>
          <p className="mt-2 text-stone-400">
            {property.location_address}, {property.location_city}, {property.location_country}
          </p>
          <p className="mt-4 text-stone-300 whitespace-pre-wrap">{property.description}</p>

          {(intentRent || intentBuy) && user && (
            <div className="mt-8 border-t border-amber-900/30 pt-6">
              {action === null && (
                <div className="flex gap-4">
                  {intentBuy && (
                    <button
                      type="button"
                      onClick={() => setAction('buy')}
                      className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-500"
                    >
                      Request to buy
                    </button>
                  )}
                  {intentRent && (
                    <button
                      type="button"
                      onClick={() => setAction('rent')}
                      className="rounded-lg border border-amber-600 bg-amber-950/50 px-4 py-2 font-medium text-amber-300 hover:bg-amber-900/50"
                    >
                      Apply to rent
                    </button>
                  )}
                </div>
              )}
              {action === 'buy' && (
                <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
                  <p className="text-sm text-stone-300">Send a message to the owner (optional)</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
                    rows={3}
                    placeholder="Introduce yourself and your interest..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handlePurchaseRequest}
                      disabled={submitting}
                      className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Submit request'}
                    </button>
                    <button type="button" onClick={() => setAction(null)} className="rounded border border-amber-700 px-4 py-2 text-amber-200 hover:bg-amber-900/50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {action === 'rent' && (
                <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
                  <p className="text-sm text-stone-300">Message to the owner (optional)</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full rounded border border-amber-800/50 bg-amber-900/30 px-3 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
                    rows={3}
                    placeholder="Tell the owner about yourself..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleRentalApply}
                      disabled={submitting}
                      className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Submit application'}
                    </button>
                    <button type="button" onClick={() => setAction(null)} className="rounded border border-amber-700 px-4 py-2 text-amber-200 hover:bg-amber-900/50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {!user && (intentRent || intentBuy) && (
            <p className="mt-6 text-stone-400">
              <Link href="/login" className="text-amber-400 hover:underline">Log in</Link> to request to buy or apply to rent.
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
