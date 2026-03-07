'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { properties as propertiesApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land (Viwanja)' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
];

const INTENTS = [
  { value: 'rent', label: 'For Rent' },
  { value: 'buy', label: 'For Sale' },
  { value: 'both', label: 'Rent or Buy' },
];

export default function NewListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [property_type, setPropertyType] = useState<'house' | 'land' | 'apartment' | 'commercial'>('house');
  const [intent, setIntent] = useState<'rent' | 'buy' | 'both'>('rent');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [location_address, setLocationAddress] = useState('');
  const [location_city, setLocationCity] = useState('');
  const [location_country, setLocationCountry] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await propertiesApi.create({
        title,
        description,
        property_type,
        intent,
        price: Number(price),
        currency,
        location_address,
        location_city,
        location_country,
        images: images.length ? images : undefined,
      });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">You must be logged in to list a property.</p>
        <Link href="/login" className="mt-4 inline-block text-amber-400 hover:underline">Log in</Link>
      </div>
    );
  }

  const canList = user.role === 'property_owner' || user.role === 'real_estate_company' || user.role === 'admin';
  if (!canList) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-400">Only property owners or real estate companies can list properties.</p>
        <Link href="/register" className="mt-4 inline-block text-amber-400 hover:underline">Register as property owner</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-amber-400">List a property</h1>
      <p className="mt-2 text-stone-400">Add your property for rent or sale. It will be reviewed before going live.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            placeholder="e.g. 3BR House in Westlands"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            placeholder="Describe the property..."
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">Type</span>
            <select
              value={property_type}
              onChange={(e) => setPropertyType(e.target.value as typeof property_type)}
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            >
              {PROPERTY_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">Intent</span>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value as typeof intent)}
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            >
              {INTENTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">Price</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            />
          </label>
          <label className="flex w-24 flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">Currency</span>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Address</span>
          <input
            type="text"
            value={location_address}
            onChange={(e) => setLocationAddress(e.target.value)}
            required
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            placeholder="Street address"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">City</span>
            <input
              type="text"
              value={location_city}
              onChange={(e) => setLocationCity(e.target.value)}
              required
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-stone-300">Country</span>
            <input
              type="text"
              value={location_country}
              onChange={(e) => setLocationCountry(e.target.value)}
              required
              className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-300">Image URLs (one per line or add below)</span>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-stone-100 focus:border-amber-600 focus:outline-none"
              placeholder="https://..."
            />
            <button type="button" onClick={addImage} className="rounded-lg border border-amber-600 px-4 py-2 text-amber-300 hover:bg-amber-900/50">
              Add
            </button>
          </div>
          {images.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {images.map((url, i) => (
                <li key={i} className="flex items-center gap-1 rounded bg-amber-900/50 px-2 py-1 text-sm">
                  <span className="max-w-[200px] truncate text-stone-400">{url}</span>
                  <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:underline">×</button>
                </li>
              ))}
            </ul>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-600 py-2.5 font-medium text-white hover:bg-amber-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for review'}
        </button>
      </form>
    </div>
  );
}
