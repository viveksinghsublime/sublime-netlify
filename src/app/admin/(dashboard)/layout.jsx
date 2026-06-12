import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
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
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-hidden">
        <AdminHeader session={session} />
        <main className="admin-scrollbar h-[calc(100vh-85px)] min-w-0 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full min-w-0 overflow-x-hidden px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
