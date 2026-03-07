import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-amber-400 sm:text-5xl">
        NyumbaLink
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-300">
        Africa&apos;s transparent real estate platform. List, buy, rent, and verify property — all in one place.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/properties"
          className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-500"
        >
          Browse properties
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-amber-700/50 bg-amber-950/50 px-6 py-3 font-medium text-amber-200 transition hover:border-amber-600 hover:bg-amber-900/30"
        >
          Get started
        </Link>
      </div>
      <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/30 p-6 text-left">
          <h3 className="font-semibold text-amber-400">List</h3>
          <p className="mt-2 text-sm text-stone-400">List houses, land (viwanja), apartments, and commercial property.</p>
        </div>
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/30 p-6 text-left">
          <h3 className="font-semibold text-amber-400">Search</h3>
          <p className="mt-2 text-sm text-stone-400">Filter by location, price, type, and rent or buy.</p>
        </div>
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/30 p-6 text-left">
          <h3 className="font-semibold text-amber-400">Verify</h3>
          <p className="mt-2 text-sm text-stone-400">Verified ownership badge for trusted listings.</p>
        </div>
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/30 p-6 text-left">
          <h3 className="font-semibold text-amber-400">Pay</h3>
          <p className="mt-2 text-sm text-stone-400">Rent and purchase payments with mobile money &amp; bank.</p>
        </div>
      </div>
    </div>
  );
}