import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listAdminJobs } from '@/lib/server/jobs';
import { listMasters } from '@/lib/server/masters';

const JobPostingList = dynamic(() => import('@/components/admin/JobPostingList'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminJobsPage() {
  const [jobs, roles, locations, employmentTypes] = await Promise.all([
    listAdminJobs().catch(() => []),
    listMasters('role').catch(() => []),
    listMasters('location').catch(() => []),
    listMasters('employmentType').catch(() => []),
  ]);

  return (
    <JobPostingList
      jobs={jobs}
      roles={roles}
      locations={locations}
      employmentTypes={employmentTypes}
    />
  );
}
