'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import { validateJobPostingForm } from '@/lib/validation';

function buildInitialState(initialRecord) {
  return {
    title: initialRecord?.title || '',
    slug: initialRecord?.slug || '',
    description: initialRecord?.description || '',
    skills_text: initialRecord?.skills_text || '',
    role_id: initialRecord?.role_id ? String(initialRecord.role_id) : '',
    location_id: initialRecord?.location_id ? String(initialRecord.location_id) : '',
    employment_type_id: initialRecord?.employment_type_id
      ? String(initialRecord.employment_type_id)
      : '',
    is_published: Boolean(initialRecord?.is_published),
  };
}

export default function JobPostingForm({
  initialRecord,
  roles,
  locations,
  employmentTypes,
  mode = 'create',
  embedded = false,
  onSuccess,
  onCancel,
}) {
  const router = useRouter();
  const [formState, setFormState] = useState(() => buildInitialState(initialRecord));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const heading = useMemo(
    () => (mode === 'edit' ? 'Edit Job Posting' : 'Create Job Posting'),
    [mode]
  );

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const validationMessage = validateJobPostingForm(formState);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        mode === 'edit' ? `/api/admin/job-posting/${initialRecord.id}` : '/api/admin/job-posting',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        }
      );

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to save the job posting.');
        return;
      }

      if (typeof onSuccess === 'function') {
        onSuccess(payload.data);
      }

      if (embedded) {
        router.refresh();
        return;
      }

      router.push('/admin/jobs');
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while saving the job posting.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid gap-6 pb-2">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Job Title"
              name="title"
              required
              value={formState.title}
              onChange={handleChange}
            />
            <InputField
              label="Slug"
              name="slug"
              required
              value={formState.slug}
              onChange={handleChange}
            />
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Role</span>
              <select
                name="role_id"
                required
                value={formState.role_id}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Location</span>
              <select
                name="location_id"
                required
                value={formState.location_id}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Employment Type</span>
              <select
                name="employment_type_id"
                required
                value={formState.employment_type_id}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">Select employment type</option>
                {employmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formState.is_published}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-800">Published</span>
              </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-800">Description</span>
            <textarea
              name="description"
              rows={6}
              required
              value={formState.description}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-800">
              Skills (comma or newline separated)
            </span>
            <textarea
              name="skills_text"
              rows={5}
              value={formState.skills_text}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        {errorMessage ? <p className="mb-3 text-sm text-red-600">{errorMessage}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          {embedded ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-slate-300"
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : (
            <Link
              href="/admin/jobs"
              className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700"
            >
              Cancel
            </Link>
          )}
          <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Job Posting' : 'Create Job Posting'}
          </Button>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{heading}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage the opening details used on the careers page and in structured data.
            </p>
          </div>

          <Link href="/admin/jobs" className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Back to Job Postings
          </Link>
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {formContent}
      </Card>
    </div>
  );
}
