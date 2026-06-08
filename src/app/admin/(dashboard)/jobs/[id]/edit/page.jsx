import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { getJobById } from '@/lib/server/jobs';
import { listMasters } from '@/lib/server/masters';

const JobPostingForm = dynamic(() => import('@/components/admin/JobPostingForm'), {
  loading: () => <AdminModuleSkeleton variant="form" />,
});

export default async function EditJobPostingPage({ params }) {
  const resolvedParams = await params;
  const [job, roles, locations, employmentTypes] = await Promise.all([
    getJobById(Number(resolvedParams.id)).catch(() => null),
    listMasters('role').catch(() => []),
    listMasters('location').catch(() => []),
    listMasters('employmentType').catch(() => []),
  ]);

  if (!job) {
    notFound();
  }

  return (
    <JobPostingForm
      mode="edit"
      initialRecord={job}
      roles={roles}
      locations={locations}
      employmentTypes={employmentTypes}
    />
  );
}
