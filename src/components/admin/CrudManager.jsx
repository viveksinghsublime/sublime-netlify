'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Card from '@/components/ui/Card';
import AdminPagination from '@/components/admin/AdminPagination';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';
import { validateCrudForm, validateReviewForm } from '@/lib/validation';

const controlClasses =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500';

const labelClasses = 'text-sm font-medium text-gray-700';

function defaultValueForField(field) {
  if (field.type === 'checkbox') return false;
  if (field.type === 'file') return null;
  return '';
}

function buildInitialState(fields, initialValues = {}) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = initialValues[field.name] ?? defaultValueForField(field);
    return accumulator;
  }, {});
}

function formatCellValue(field, value, item) {
  if (field.type === 'checkbox') {
    return value ? 'Yes' : 'No';
  }

  if (field.type === 'select' && Array.isArray(field.options)) {
    return field.options.find((option) => option.value === String(value))?.label || '-';
  }

  if (field.format === 'status') {
    return Number(value) === 1 ? 'Active' : 'Deleted';
  }

  if (field.type === 'file') {
    return value ? 'Uploaded' : 'No file';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'string' && value.length > 90) {
    return `${value.slice(0, 90)}...`;
  }

  return value || '-';
}

function CrudModal({
  title,
  description,
  children,
  onClose,
}) {
  return (
      <div className="fixed inset-0 z-[70] bg-slate-950/70 px-4 py-4 sm:py-6">
      <div className="flex h-full items-center justify-center">
        <Card className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:h-[calc(100vh-3rem)] sm:p-6">
          <div className="mb-5 flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
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

          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </Card>
      </div>
    </div>
  );
}

function renderReadOnlyField(field, value) {
  if (field.type === 'textarea') {
    return (
      <div key={field.name} className="grid gap-2 md:col-span-2">
        <span className={labelClasses}>{field.label}</span>
        <textarea
          readOnly
          rows={field.rows || 5}
          value={typeof value === 'string' ? value : value || ''}
          className={`${controlClasses} min-h-[120px] resize-none`}
        />
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label key={field.name} className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          readOnly
          disabled
          className="h-4 w-4"
        />
        <span className={labelClasses}>{field.label}</span>
      </label>
    );
  }

  return (
    <div key={field.name} className="grid gap-2">
      <span className={labelClasses}>{field.label}</span>
      <input
        readOnly
        value={formatCellValue(field, value) === '-' ? '' : formatCellValue(field, value)}
        className={controlClasses}
      />
    </div>
  );
}

export default function CrudManager({
  title,
  description,
  endpoint,
  fields,
  initialItems,
  createLabel,
  searchPlaceholder,
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [formState, setFormState] = useState(() => buildInitialState(fields));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);

  const hasFileField = useMemo(() => fields.some((field) => field.type === 'file'), [fields]);
  const tableFields = useMemo(() => fields.filter((field) => !field.hideInTable), [fields]);
  const formFields = useMemo(() => fields.filter((field) => !field.hideInForm), [fields]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      tableFields.some((field) => {
        const value = formatCellValue(field, item[field.name], item);
        return String(value).toLowerCase().includes(normalizedQuery);
      })
    );
  }, [items, searchTerm, tableFields]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pageSize, safeCurrentPage]);
  const startIndex = filteredItems.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = filteredItems.length === 0 ? 0 : Math.min(safeCurrentPage * pageSize, filteredItems.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function closeModal() {
    setActiveModal(null);
    setSelectedItem(null);
    setFormState(buildInitialState(fields));
    setErrorMessage('');
  }

  function openCreateModal() {
    setSelectedItem(null);
    setFormState(buildInitialState(fields));
    setErrorMessage('');
    setActiveModal('create');
  }

  function openEditModal(item) {
    setSelectedItem(item);
    setFormState(buildInitialState(fields, item));
    setErrorMessage('');
    setActiveModal('edit');
  }

  function openViewModal(item) {
    setSelectedItem(item);
    setActiveModal('view');
  }

  function handleChange(event, field) {
    const nextValue =
      field.type === 'checkbox'
        ? event.target.checked
        : field.type === 'file'
          ? event.target.files?.[0] || null
          : event.target.value;

    setFormState((current) => ({
      ...current,
      [field.name]: nextValue,
    }));
  }

  async function handleDelete(id) {
    setDeletingId(id);

    try {
      const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to delete this record.');
        return;
      }

      setItems((current) => current.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        closeModal();
      }
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while deleting this record.');
    } finally {
      setDeletingId(null);
      setPendingDeleteItem(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const validationMessage =
      title === 'Reviews' ? validateReviewForm(formState) : validateCrudForm(formFields, formState);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (hasFileField) {
        const formData = new FormData();
        const payload = {};

        fields.forEach((field) => {
          const value = formState[field.name];
          if (field.type === 'file') {
            if (value) {
              formData.append(field.name, value);
            }
            return;
          }

          payload[field.name] = value;
        });

        formData.append('payload', JSON.stringify(payload));
        response = await fetch(selectedItem ? `${endpoint}/${selectedItem.id}` : endpoint, {
          method: selectedItem ? 'PUT' : 'POST',
          body: formData,
        });
      } else {
        response = await fetch(selectedItem ? `${endpoint}/${selectedItem.id}` : endpoint, {
          method: selectedItem ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });
      }

      const responsePayload = await response.json();
      if (!response.ok) {
        setErrorMessage(responsePayload.message || 'Unable to save this record.');
        return;
      }

      const savedItem = responsePayload.data;
      setItems((current) =>
        selectedItem
          ? current.map((item) => (item.id === savedItem?.id ? savedItem : item))
          : savedItem
            ? [savedItem, ...current]
            : current
      );
      setCurrentPage(1);

      closeModal();
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while saving this record.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-6 pb-2">
            <div className="grid gap-5 md:grid-cols-2">
              {formFields.map((field) => {
                if (field.type === 'textarea') {
                  return (
                    <label key={field.name} className="grid gap-2 md:col-span-2">
                      <span className={labelClasses}>
                        {field.label}
                        {field.required ? <span className="ml-1 text-red-500">*</span> : null}
                      </span>
                      <textarea
                        rows={field.rows || 5}
                        required={field.required}
                        value={formState[field.name] || ''}
                        onChange={(event) => handleChange(event, field)}
                        className={`${controlClasses} min-h-[120px] resize-y`}
                      />
                    </label>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <label key={field.name} className="grid gap-2">
                      <span className={labelClasses}>
                        {field.label}
                        {field.required ? <span className="ml-1 text-red-500">*</span> : null}
                      </span>
                      <select
                        required={field.required}
                        value={formState[field.name] ?? ''}
                        onChange={(event) => handleChange(event, field)}
                        className={controlClasses}
                      >
                        <option value="">Select</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                if (field.type === 'checkbox') {
                  return (
                    <label key={field.name} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(formState[field.name])}
                        onChange={(event) => handleChange(event, field)}
                        className="h-4 w-4"
                      />
                      <span className={labelClasses}>{field.label}</span>
                    </label>
                  );
                }

                if (field.type === 'file') {
                  return (
                    <label key={field.name} className="grid gap-2">
                      <span className={labelClasses}>
                        {field.label}
                        {field.required ? <span className="ml-1 text-red-500">*</span> : null}
                      </span>
                      <input
                        type="file"
                        accept={field.accept}
                        onChange={(event) => handleChange(event, field)}
                        className="block w-full text-sm text-gray-900 file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-50"
                      />
                    </label>
                  );
                }

                return (
                  <InputField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    value={formState[field.name] ?? ''}
                    onChange={(event) => handleChange(event, field)}
                    type={field.type || 'text'}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          {errorMessage ? <p className="mb-3 text-sm text-red-600">{errorMessage}</p> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-slate-300"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : selectedItem ? `Update ${title}` : createLabel || `Create ${title}`}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  function renderView() {
    return (
      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="grid gap-5 pb-2">
            <div className="grid gap-5 md:grid-cols-2">
              {formFields.map((field) =>
                renderReadOnlyField(field, selectedItem?.[field.name], selectedItem)
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-slate-300"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={() => {
                setFormState(buildInitialState(fields, selectedItem));
                setActiveModal('edit');
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {createLabel || `Create ${title}`}
          </button>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={searchPlaceholder || `Search ${title.toLowerCase()}`}
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
                {tableFields.map((field) => (
                  <th
                    key={field.name}
                    className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  {tableFields.map((field) => (
                    <td key={field.name} className="px-4 py-4 text-sm text-slate-700">
                      {formatCellValue(field, item[field.name], item)}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openViewModal(item)}
                        className="text-slate-500 transition-colors hover:text-blue-600"
                        aria-label={`View ${title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="text-slate-500 transition-colors hover:text-amber-600"
                        aria-label={`Edit ${title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteItem(item)}
                        disabled={deletingId === item.id}
                        className="text-slate-500 transition-colors hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={tableFields.length + 1} className="px-4 py-10 text-center text-sm text-slate-500">
                    No records found.
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
          totalItems={filteredItems.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </Card>

      {activeModal === 'create' ? (
        <CrudModal
          title={createLabel || `Create ${title}`}
          description={description}
          onClose={closeModal}
        >
          {renderForm()}
        </CrudModal>
      ) : null}

      {activeModal === 'edit' ? (
        <CrudModal title={`Edit ${title}`} description={description} onClose={closeModal}>
          {renderForm()}
        </CrudModal>
      ) : null}

      {activeModal === 'view' ? (
        <CrudModal title={`View ${title}`} description={description} onClose={closeModal}>
          {renderView()}
        </CrudModal>
      ) : null}

      {pendingDeleteItem ? (
        <DeleteConfirmationModal
          title={`Delete ${title}`}
          message="Are you sure you want to delete this record? This action will remove it from the active admin list."
          confirmLabel={`Delete ${title}`}
          isDeleting={deletingId === pendingDeleteItem.id}
          onCancel={() => {
            if (!deletingId) {
              setPendingDeleteItem(null);
            }
          }}
          onConfirm={() => handleDelete(pendingDeleteItem.id)}
        />
      ) : null}
    </div>
  );
}
