import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listMasters } from '@/lib/server/masters';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminJobLocationsPage() {
  const records = await listMasters('location').catch(() => []);

  const fields = [
    { name: 'name', label: 'Location Name', required: true },
  ];

  return (
    <CrudManager
      title="Job Locations"
      description="Manage location options for public careers filters and job schema."
      endpoint="/api/admin/job-location"
      fields={fields}
      initialItems={records}
      createLabel="Add Job Location"
      searchPlaceholder="Search job locations"
    />
  );
}
