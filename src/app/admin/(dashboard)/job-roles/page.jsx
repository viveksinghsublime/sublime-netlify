import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listMasters } from '@/lib/server/masters';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminJobRolesPage() {
  const records = await listMasters('role').catch(() => []);

  const fields = [
    { name: 'name', label: 'Role Name', required: true },
  ];

  return (
    <CrudManager
      title="Job Roles"
      description="Manage the role master used to filter and tag job postings."
      endpoint="/api/admin/job-role"
      fields={fields}
      initialItems={records}
      createLabel="Create Job Role"
      searchPlaceholder="Search job roles"
    />
  );
}
