'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Mail, Phone, Search, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdminPagination from '@/components/admin/AdminPagination';
import { formatAdminDateTime } from '@/lib/adminDate';

function ContactDetailModal({ record, onClose }) {
  if (!record) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/70 px-4 py-6">
      <div className="flex h-full items-center justify-center">
        <Card className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:h-[calc(100vh-3rem)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Contact Request</h2>
              <p className="mt-2 text-sm text-slate-600">
                Submitted on {formatAdminDateTime(record.created_at)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="admin-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.name || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900">{record.email || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.phone || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.company_name || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.service_interested_in || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.source || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{record.subject || '-'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {record.message || 'No message provided.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-slate-300"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ContactRequestTable({ records }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return records;
    }

    return records.filter((record) =>
      [
        record.name,
        record.email,
        record.phone,
        record.company_name,
        record.service_interested_in,
        record.subject,
        record.source,
        record.message,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [records, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRecords = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, pageSize, safeCurrentPage]);
  const startIndex = filteredRecords.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex =
    filteredRecords.length === 0 ? 0 : Math.min(safeCurrentPage * pageSize, filteredRecords.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contact Us Requests</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review enquiries submitted through the website contact form.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Total Requests</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{records.length}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name, email, company, service, or message"
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
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Company</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Service</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">{record.name || '-'}</p>
                    <p className="mt-1 max-w-[240px] truncate text-slate-500">{record.subject || '-'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="break-all">{record.email || '-'}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-slate-500">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{record.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{record.company_name || '-'}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{record.service_interested_in || '-'}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatAdminDateTime(record.created_at)}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className="text-slate-500 transition-colors hover:text-blue-600"
                      aria-label="View contact request"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No contact requests found.
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
          totalItems={filteredRecords.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </Card>

      <ContactDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}
