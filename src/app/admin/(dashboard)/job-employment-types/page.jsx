import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listMasters } from '@/lib/server/masters';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminEmploymentTypesPage() {
  const records = await listMasters('employmentType').catch(() => []);

  const fields = [
    { name: 'name', label: 'Display Name', required: true },
    { name: 'value', label: 'Schema Value', required: true },
  ];

  return (
    <CrudManager
      title="Employment Types"
      description="Manage employment type labels and schema values such as FULL_TIME."
      endpoint="/api/admin/job-employment-type"
      fields={fields}
      initialItems={records}
      createLabel="Add Employment Type"
      searchPlaceholder="Search employment types"
    />
  );
}
