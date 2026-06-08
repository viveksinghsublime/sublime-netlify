import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listMasters } from '@/lib/server/masters';

const JobPostingForm = dynamic(() => import('@/components/admin/JobPostingForm'), {
  loading: () => <AdminModuleSkeleton variant="form" />,
});

export default async function NewJobPostingPage() {
  const [roles, locations, employmentTypes] = await Promise.all([
    listMasters('role').catch(() => []),
    listMasters('location').catch(() => []),
    listMasters('employmentType').catch(() => []),
  ]);

  return (
    <JobPostingForm
      mode="create"
      roles={roles}
      locations={locations}
      employmentTypes={employmentTypes}
    />
  );
}
