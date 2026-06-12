'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, ShieldUser } from 'lucide-react';
import AdminProfileModal from '@/components/admin/AdminProfileModal';

function getInitials(name = '') {
  return (
    String(name)
      .split(' ')
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SA'
  );
}

export default function AdminHeader({ session }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const name = session?.name || 'Sublime Admin';
  const email = session?.email || 'admin@sublimetechnocorp.com';
  const initials = getInitials(name || email);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex min-h-[84px] items-center justify-end px-6">
          <div ref={containerRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition hover:border-blue-200 hover:shadow"
              aria-expanded={isOpen}
              aria-label="Open account menu"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
                {initials}
              </span>

              <span className="min-w-0 text-left">
                <span className="block truncate text-sm font-semibold leading-5 text-slate-900">
                  {name}
                </span>
                <span className="block truncate text-xs leading-5 text-slate-500">{email}</span>
              </span>

              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen ? (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[260px] rounded-[24px] border border-slate-200 bg-slate-50 p-3 shadow-xl">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                    <p className="truncate text-xs text-slate-500">{email}</p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <ShieldUser className="h-4 w-4" />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <AdminProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={name}
        userEmail={email}
      />
    </>
  );
}
