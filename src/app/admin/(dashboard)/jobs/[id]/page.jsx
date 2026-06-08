import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, Pencil } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getJobById } from '@/lib/server/jobs';

function DetailRow({ label, value }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm text-slate-800">{value || '-'}</span>
    </div>
  );
}

export default async function JobPostingDetailPage({ params }) {
  const resolvedParams = await params;
  const job = await getJobById(Number(resolvedParams.id)).catch(() => null);

  if (!job) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <Eye className="h-3.5 w-3.5" />
              View Job Posting
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review the published data for this careers listing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/jobs/${job.id}/edit`}>
              <Button type="button" variant="secondary" className="rounded-xl">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Job Posting
              </Button>
            </Link>
            <Link href="/admin/jobs" className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
              Back to Job Postings
            </Link>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailRow label="Role" value={job.role_name} />
          <DetailRow label="Location" value={job.location_name} />
          <DetailRow label="Employment Type" value={job.employment_type_name} />
          <DetailRow label="Published" value={Number(job.is_published) === 1 ? 'Yes' : 'No'} />
          <DetailRow label="Slug" value={job.slug} />
          <DetailRow label="Updated" value={job.updated_at ? new Date(job.updated_at).toLocaleString() : '-'} />
        </div>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {job.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {job.skills?.length ? job.skills.join(', ') : '-'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
