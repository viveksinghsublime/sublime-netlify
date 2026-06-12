'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import AdminPagination from '@/components/admin/AdminPagination';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';
import { formatAdminDate } from '@/lib/adminDate';

const JobPostingForm = dynamic(() => import('@/components/admin/JobPostingForm'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />,
});

export default function JobPostingList({ jobs, roles, locations, employmentTypes }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingDeleteJob, setPendingDeleteJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return jobs;
    }

    return jobs.filter((job) =>
      [job.title, job.role_name, job.location_name, job.employment_type_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [jobs, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, pageSize, safeCurrentPage]);
  const startIndex = filteredJobs.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = filteredJobs.length === 0 ? 0 : Math.min(safeCurrentPage * pageSize, filteredJobs.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  async function handleDelete(id) {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/job-posting/${id}`, {
        method: 'DELETE',
      });

      const payload = await response.json();
      if (!response.ok) {
        window.alert(payload.message || 'Unable to delete this job posting.');
        return;
      }

      router.refresh();
    } catch {
      window.alert('Something went wrong while deleting this job posting.');
    } finally {
      setDeletingId(null);
      setPendingDeleteJob(null);
    }
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Job Postings</h1>
            <p className="mt-2 text-sm text-slate-600">
              Publish openings that power the public careers page and its structured data.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Job Posting
          </button>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by title, role, location, or employment type"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Employment Type
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Published
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Updated
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{job.title}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{job.role_name || '-'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{job.location_name || '-'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {job.employment_type_name || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {Number(job.is_published) === 1 ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{formatAdminDate(job.updated_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="text-slate-500 transition-colors hover:text-blue-600"
                        aria-label={`View ${job.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="text-slate-500 transition-colors hover:text-amber-600"
                        aria-label={`Edit ${job.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteJob(job)}
                        disabled={deletingId === job.id}
                        className="text-slate-500 transition-colors hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${job.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    No job postings found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredJobs.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </Card>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/70 px-4 py-4 sm:py-6">
          <div className="flex h-full items-center justify-center">
            <Card className="flex h-[calc(100vh-2rem)] w-full max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:h-[calc(100vh-3rem)] sm:p-6">
              <div className="mb-5 flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create Job Posting</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Add a new opening for the public careers page and structured data.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Close create job posting modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1">
                <JobPostingForm
                  mode="create"
                  embedded
                  roles={roles}
                  locations={locations}
                  employmentTypes={employmentTypes}
                  onCancel={() => setIsCreateModalOpen(false)}
                  onSuccess={() => {
                    setCurrentPage(1);
                    setIsCreateModalOpen(false);
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {pendingDeleteJob ? (
        <DeleteConfirmationModal
          title="Delete Job Posting"
          message={`Are you sure you want to delete "${pendingDeleteJob.title}"? This action will remove it from the active job postings list.`}
          confirmLabel="Delete Job Posting"
          isDeleting={deletingId === pendingDeleteJob.id}
          onCancel={() => {
            if (!deletingId) {
              setPendingDeleteJob(null);
            }
          }}
          onConfirm={() => handleDelete(pendingDeleteJob.id)}
        />
      ) : null}
    </div>
  );
}
