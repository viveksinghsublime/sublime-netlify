import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import { getAdminSessionFromCookieStore } from '@/lib/server/auth';

export const metadata = {
  title: 'Admin | Sublime Technocorp',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = getAdminSessionFromCookieStore(cookieStore);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <header className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Sublime Admin
            </p>
            <h1 className="text-lg font-bold text-slate-900">Content Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{session.name}</p>
              <p className="text-xs text-slate-500">{session.email}</p>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-8 overflow-hidden px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="admin-scrollbar min-h-0 overflow-y-auto">
          <AdminSidebar />
        </aside>
        <main className="admin-scrollbar min-h-0 overflow-y-auto pr-1">{children}</main>
      </div>
    </div>
  );
}
