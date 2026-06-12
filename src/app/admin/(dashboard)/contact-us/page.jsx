import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listAdminContacts } from '@/lib/server/contact';

const ContactRequestTable = dynamic(() => import('@/components/admin/ContactRequestTable'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminContactUsPage() {
  const records = await listAdminContacts().catch(() => []);

  return <ContactRequestTable records={records} />;
}
