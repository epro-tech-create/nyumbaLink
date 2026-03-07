'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-amber-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-amber-400">
          <span className="text-xl">NyumbaLink</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/properties" className="text-amber-100/90 hover:text-amber-400">
            Browse
          </Link>
          {user ? (
            <>
              {(user.role === 'property_owner' || user.role === 'real_estate_company') && (
                <Link href="/listings/new" className="text-amber-100/90 hover:text-amber-400">
                  List Property
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="text-amber-100/90 hover:text-amber-400">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-amber-100/90 hover:text-amber-400">
                Dashboard
              </Link>
              <span className="text-amber-200/80 text-sm">{user.full_name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded bg-amber-800/50 px-3 py-1.5 text-sm text-amber-200 hover:bg-amber-700/50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-amber-100/90 hover:text-amber-400">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
