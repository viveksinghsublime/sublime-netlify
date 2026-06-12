'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  Star,
} from 'lucide-react';
import { getVisibleAdminNavigation } from '@/lib/adminModules';

const NAV_ICON_MAP = {
  dashboard: LayoutDashboard,
  caseStudyGroup: FolderKanban,
  jobGroup: BriefcaseBusiness,
  reviews: Star,
  contacts: MessageSquareMore,
};

function isPathActive(pathname, href) {
  if (href === '/admin') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveChild(pathname, item) {
  if (item.type !== 'group') {
    return isPathActive(pathname, item.href);
  }

  return item.children.some((child) => isPathActive(pathname, child.href));
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = useMemo(() => getVisibleAdminNavigation(), []);
  const [openGroups, setOpenGroups] = useState(() =>
    navigation.reduce((state, item) => {
      if (item.type === 'group') {
        state[item.key] = hasActiveChild(pathname, item);
      }
      return state;
    }, {})
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setOpenGroups((current) =>
      navigation.reduce((state, item) => {
        if (item.type === 'group') {
          state[item.key] = current[item.key] || hasActiveChild(pathname, item);
        }
        return state;
      }, {})
    );
  }, [navigation, pathname]);

  function toggleGroup(key) {
    setOpenGroups((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <aside className="flex h-screen w-full max-w-[310px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Sublime Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Content Panel</h1>
        <p className="mt-2 text-sm text-slate-500">Manage website content from one place.</p>
      </div>

      <nav className="admin-scrollbar flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = NAV_ICON_MAP[item.key] || LayoutDashboard;

            if (item.type === 'group') {
              const isOpen = openGroups[item.key] ?? false;
              const isGroupActive = hasActiveChild(pathname, item);

              return (
                <div key={item.key} className="rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                      isGroupActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isGroupActive ? 'bg-white/15' : 'bg-white text-blue-600 shadow-sm'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  {isOpen ? (
                    <div className="mt-2 space-y-1 px-2 pb-1">
                      {item.children.map((child) => {
                        const isActive = isPathActive(pathname, child.href);
                        return (
                          <Link
                            key={child.key}
                            href={child.href}
                            className={`flex items-center rounded-2xl px-4 py-3 text-sm transition ${
                              isActive
                                ? 'bg-blue-50 font-semibold text-blue-700'
                                : 'text-slate-600 hover:bg-white hover:text-slate-900'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            const isActive = isPathActive(pathname, item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-[24px] border px-4 py-3.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isActive ? 'bg-white/15' : 'bg-slate-50 text-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 bg-white p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
