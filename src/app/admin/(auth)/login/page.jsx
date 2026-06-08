import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';

const AdminLoginForm = dynamic(() => import('@/components/admin/AdminLoginForm'), {
  loading: () => <AdminModuleSkeleton variant="form" />,
});

export const metadata = {
  title: 'Admin Login | Sublime Technocorp',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Admin Panel
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Manage content for case studies, careers, and reviews.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Sign in with your admin credentials to update site content without depending on the
            external API server.
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
