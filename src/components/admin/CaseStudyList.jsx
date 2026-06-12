'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import AdminPagination from '@/components/admin/AdminPagination';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';
import { getCaseStudyMediaUrl } from '@/lib/caseStudyShared';
import { formatAdminDate } from '@/lib/adminDate';

const CaseStudyForm = dynamic(() => import('@/components/admin/CaseStudyForm'), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />,
});

function formatText(value) {
  return value || '-';
}

function PreviewImage({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 ${className}`}>
        No image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>
      <Image
        src={getCaseStudyMediaUrl(src)}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-contain"
      />
    </div>
  );
}

function ReadOnlyField({ label, value, className = '' }) {
  return (
    <div className={`grid gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 whitespace-pre-wrap break-words">{formatText(value)}</span>
    </div>
  );
}

function CaseStudyViewModal({ caseStudy, onClose }) {
  const productImages = Array.isArray(caseStudy?.product_image) ? caseStudy.product_image : [];
  const keypoints = Array.isArray(caseStudy?.keypoints) ? caseStudy.keypoints : [];
  const features = Array.isArray(caseStudy?.features) ? caseStudy.features : [];
  const whyUsData = Array.isArray(caseStudy?.why_us_data) ? caseStudy.why_us_data : [];

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/70 px-4 py-4 sm:py-6">
      <div className="flex h-full items-center justify-center">
        <Card className="flex h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:h-[calc(100vh-3rem)] sm:p-6">
          <div className="mb-5 flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{caseStudy.title}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Review the current case study content in read-only mode.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-6 pb-2">
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ReadOnlyField label="Title" value={caseStudy.title} />
                <ReadOnlyField label="Category URL Name" value={caseStudy.category_url_name} />
                <ReadOnlyField label="Category" value={caseStudy.category_name} />
                <ReadOnlyField label="Subcategory" value={caseStudy.subcategory_name} />
                <ReadOnlyField label="Subtitle" value={caseStudy.sub_title} className="md:col-span-2" />
                <ReadOnlyField label="Short URL" value={caseStudy.short_url} />
                <ReadOnlyField label="Accent Color" value={caseStudy.colorCode ? `#${String(caseStudy.colorCode).replace('#', '')}` : ''} />
                <ReadOnlyField label="Top Project" value={caseStudy.isTopProject ? 'Yes' : 'No'} />
                <ReadOnlyField label="Updated" value={formatAdminDate(caseStudy.updated_at)} />
              </section>

              <section className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">SEO Content</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ReadOnlyField label="SEO Title" value={caseStudy.seo_title} />
                  <ReadOnlyField label="Keywords" value={caseStudy.keywords} />
                  <ReadOnlyField
                    label="SEO Description"
                    value={caseStudy.seo_description}
                    className="md:col-span-2"
                  />
                </div>
              </section>

              <section className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">Narrative</h3>
                <div className="grid gap-4">
                  <ReadOnlyField label="Situation" value={caseStudy.situation} />
                  <ReadOnlyField label="Solution" value={caseStudy.solution} />
                  <ReadOnlyField label="Product Description" value={caseStudy.product_description} />
                  <ReadOnlyField label="Feature Section Title" value={caseStudy.feature_title} />
                  <ReadOnlyField label="Why Us Title" value={caseStudy.why_us_title} />
                </div>
              </section>

              <section className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">Media</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Main Image</span>
                    <PreviewImage src={caseStudy.image} alt={`${caseStudy.title} main image`} className="aspect-[4/3]" />
                  </div>
                  <div className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Logo</span>
                    <PreviewImage src={caseStudy.logo} alt={`${caseStudy.title} logo`} className="aspect-[4/3]" />
                  </div>
                  <div className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cover Image</span>
                    <PreviewImage src={caseStudy.cover_image} alt={`${caseStudy.title} cover image`} className="aspect-[4/3]" />
                  </div>
                </div>
              </section>

              <section className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Key Highlights</h3>
                  <span className="text-sm text-slate-500">{keypoints.length} items</span>
                </div>
                {keypoints.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {keypoints.map((keypoint, index) => (
                      <div key={`view-keypoint-${index}`} className="grid gap-4 rounded-2xl border border-slate-200 p-4">
                        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                          <div className="grid gap-4">
                            <ReadOnlyField label="Title" value={keypoint.title} />
                            <ReadOnlyField label="Subtitle" value={keypoint.subtitle} />
                          </div>
                          <div className="grid gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image</span>
                            <PreviewImage
                              src={keypoint.image}
                              alt={`${caseStudy.title} keypoint ${index + 1}`}
                              className="aspect-[4/3]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No key highlights added.
                  </div>
                )}
              </section>

              <section className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Feature Groups</h3>
                  <span className="text-sm text-slate-500">{features.length} groups</span>
                </div>
                {features.length > 0 ? (
                  <div className="grid gap-4">
                    {features.map((group, groupIndex) => (
                      <div key={`view-feature-group-${groupIndex}`} className="rounded-2xl border border-slate-200 p-4">
                        <ReadOnlyField label="Feature Group" value={group.feature} />
                        <div className="mt-4 grid gap-4">
                          {(Array.isArray(group.details) ? group.details : []).map((detail, detailIndex) => (
                            <div
                              key={`view-feature-detail-${groupIndex}-${detailIndex}`}
                              className="grid gap-4 rounded-2xl border border-dashed border-slate-300 p-4 lg:grid-cols-[1.5fr_1fr]"
                            >
                              <div className="grid gap-4">
                                <ReadOnlyField label="Detail Name" value={detail.name} />
                                <ReadOnlyField label="Description" value={detail.description} />
                              </div>
                              <div className="grid gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image</span>
                                <PreviewImage
                                  src={detail.image}
                                  alt={`${caseStudy.title} feature detail ${detailIndex + 1}`}
                                  className="aspect-[4/3]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No feature groups added.
                  </div>
                )}
              </section>

              <section className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Product Gallery</h3>
                  <span className="text-sm text-slate-500">{productImages.length} images</span>
                </div>
                {productImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {productImages.map((item, index) => {
                      const url = typeof item === 'string' ? item : item?.url;
                      return (
                        <div key={`view-product-image-${index}`} className="grid gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Image {index + 1}
                          </span>
                          <PreviewImage
                            src={url}
                            alt={`${caseStudy.title} product image ${index + 1}`}
                            className="aspect-[4/3]"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No product gallery images added.
                  </div>
                )}
              </section>

              <section className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Why Us Data</h3>
                  <span className="text-sm text-slate-500">{whyUsData.length} items</span>
                </div>
                {whyUsData.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {whyUsData.map((item, index) => (
                      <div key={`view-why-us-${index}`} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1.5fr_1fr]">
                        <div className="grid gap-4">
                          <ReadOnlyField label="Title" value={item?.title} />
                          <ReadOnlyField label="Description" value={item?.description} />
                        </div>
                        <div className="grid gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Icon / Image</span>
                          <PreviewImage
                            src={item?.icon}
                            alt={`${caseStudy.title} why us ${index + 1}`}
                            className="aspect-[4/3]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No Why Us data added.
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="mt-6 flex flex-shrink-0 justify-end border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CaseStudyFormModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/70 px-4 py-4 sm:py-6">
      <div className="flex h-full items-center justify-center">
        <Card className="flex h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:h-[calc(100vh-3rem)] sm:p-6">
          <div className="mb-5 flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1">{children}</div>
        </Card>
      </div>
    </div>
  );
}

export default function CaseStudyList({ caseStudies, categories, subcategories }) {
  const router = useRouter();
  const [items, setItems] = useState(caseStudies);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [pendingDeleteCaseStudy, setPendingDeleteCaseStudy] = useState(null);

  const filteredStudies = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((caseStudy) =>
      [caseStudy.title, caseStudy.category_name, caseStudy.subcategory_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [items, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredStudies.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudies = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredStudies.slice(start, start + pageSize);
  }, [filteredStudies, pageSize, safeCurrentPage]);
  const startIndex = filteredStudies.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = filteredStudies.length === 0 ? 0 : Math.min(safeCurrentPage * pageSize, filteredStudies.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function closeModal() {
    setActiveModal(null);
    setActiveCaseStudy(null);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/casestudy/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        window.alert(payload.message || 'Unable to delete this case study.');
        return;
      }

      setItems((current) => current.filter((item) => item.id !== id));
      if (activeCaseStudy?.id === id) {
        closeModal();
      }
      router.refresh();
    } catch {
      window.alert('Something went wrong while deleting this case study.');
    } finally {
      setDeletingId(null);
      setPendingDeleteCaseStudy(null);
    }
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Case Studies</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage portfolio entries that power the works listing, detail pages, and SEO assets.
            </p>
          </div>

          <Link
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setActiveModal('create');
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Case Study
          </Link>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by title, category, or subcategory"
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
                  Category
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
              {paginatedStudies.map((caseStudy) => (
                <tr key={caseStudy.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{caseStudy.title}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {[caseStudy.category_name, caseStudy.subcategory_name].filter(Boolean).join(' / ') || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{formatAdminDate(caseStudy.updated_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCaseStudy(caseStudy);
                          setActiveModal('view');
                        }}
                        className="text-slate-500 transition-colors hover:text-blue-600"
                        aria-label={`View ${caseStudy.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCaseStudy(caseStudy);
                          setActiveModal('edit');
                        }}
                        className="text-slate-500 transition-colors hover:text-amber-600"
                        aria-label={`Edit ${caseStudy.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteCaseStudy(caseStudy)}
                        disabled={deletingId === caseStudy.id}
                        className="text-slate-500 transition-colors hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${caseStudy.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                    No case studies found.
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
          totalItems={filteredStudies.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </Card>

      {activeModal === 'view' && activeCaseStudy ? (
        <CaseStudyViewModal caseStudy={activeCaseStudy} onClose={closeModal} />
      ) : null}

      {activeModal === 'create' ? (
        <CaseStudyFormModal title="Add Case Study" onClose={closeModal}>
          <CaseStudyForm
            categories={categories}
            subcategories={subcategories}
            isModal
            onCancel={closeModal}
            createLabel="Add Case Study"
            onSuccess={(savedItem) => {
              if (savedItem) {
                setItems((current) => [savedItem, ...current]);
              }
              setCurrentPage(1);
              closeModal();
              router.refresh();
            }}
          />
        </CaseStudyFormModal>
      ) : null}

      {activeModal === 'edit' && activeCaseStudy ? (
        <CaseStudyFormModal title="Edit Case Study" onClose={closeModal}>
          <CaseStudyForm
            initialRecord={activeCaseStudy}
            categories={categories}
            subcategories={subcategories}
            isModal
            onCancel={closeModal}
            onSuccess={(savedItem) => {
              if (savedItem) {
                setItems((current) =>
                  current.map((item) => (item.id === savedItem.id ? savedItem : item))
                );
              }
              setCurrentPage(1);
              closeModal();
              router.refresh();
            }}
          />
        </CaseStudyFormModal>
      ) : null}

      {pendingDeleteCaseStudy ? (
        <DeleteConfirmationModal
          title="Delete Case Study"
          message={`Are you sure you want to delete "${pendingDeleteCaseStudy.title}"? This action will remove it from the active case studies list.`}
          confirmLabel="Delete Case Study"
          isDeleting={deletingId === pendingDeleteCaseStudy.id}
          onCancel={() => {
            if (!deletingId) {
              setPendingDeleteCaseStudy(null);
            }
          }}
          onConfirm={() => handleDelete(pendingDeleteCaseStudy.id)}
        />
      ) : null}
    </div>
  );
}
