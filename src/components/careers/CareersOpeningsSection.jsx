'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { validateJobApplicationForm } from '@/lib/validation';

const ALL_VALUE = 'all';

function buildOptions(items, labelKey = 'name') {
  return [
    { value: ALL_VALUE, label: 'All' },
    ...items.map((item) => ({
      value: String(item.id),
      label: item[labelKey],
    })),
  ];
}

function JobApplicationModal({ job, onClose }) {
  const [formState, setFormState] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    message: '',
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value, files } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: files ? files[0] || null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const validationMessage = validateJobApplicationForm(formState);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('jobId', String(job.id));
      formData.append('jobTitle', job.title);
      formData.append('fullName', formState.fullName);
      formData.append('emailAddress', formState.emailAddress);
      formData.append('phoneNumber', formState.phoneNumber);
      formData.append('message', formState.message);
      if (formState.resume) {
        formData.append('resume', formState.resume);
      }

      const response = await fetch('/api/jobapplication/submit', {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to submit the application.');
        return;
      }

      window.alert('Application submitted successfully.');
      onClose();
    } catch {
      setErrorMessage('Something went wrong while submitting the application.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-8">
      <Card className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Apply Now</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">{job.title}</h3>
          </div>
          <button type="button" className="text-sm font-medium text-slate-500" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Full Name
              <input
                required
                name="fullName"
                value={formState.fullName}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Email Address
              <input
                required
                type="email"
                name="emailAddress"
                value={formState.emailAddress}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Phone Number
              <input
                required
                name="phoneNumber"
                value={formState.phoneNumber}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Resume / CV
              <input
                required
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Message
            <textarea
              rows={5}
              name="message"
              value={formState.message}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
            />
          </label>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function CareersOpeningsSection({ jobs, roles, locations, employmentTypes }) {
  const [selectedRole, setSelectedRole] = useState(ALL_VALUE);
  const [selectedLocation, setSelectedLocation] = useState(ALL_VALUE);
  const [selectedType, setSelectedType] = useState(ALL_VALUE);
  const [activeJob, setActiveJob] = useState(null);

  const roleOptions = useMemo(() => buildOptions(roles), [roles]);
  const locationOptions = useMemo(() => buildOptions(locations), [locations]);
  const typeOptions = useMemo(() => buildOptions(employmentTypes), [employmentTypes]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesRole = selectedRole === ALL_VALUE || String(job.role_id) === selectedRole;
        const matchesLocation =
          selectedLocation === ALL_VALUE || String(job.location_id) === selectedLocation;
        const matchesType =
          selectedType === ALL_VALUE || String(job.employment_type_id) === selectedType;

        return matchesRole && matchesLocation && matchesType;
      }),
    [jobs, selectedRole, selectedLocation, selectedType]
  );

  return (
    <>
      <section id="job-openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Job Openings</h2>
            <div className="w-28 h-1 bg-gray-400 mx-auto mb-6"></div>
            <p className="text-xl font-medium text-gray-700 max-w-2xl mx-auto">
              Join our family of innovators and problem-solvers. Explore current opportunities and
              find your perfect role.
            </p>
          </div>

          <Card className="border border-gray-300 p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <label className="grid gap-2 text-sm font-semibold text-black">
                Role
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Location
                <select
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Employment Type
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSelectedRole(ALL_VALUE);
                    setSelectedLocation(ALL_VALUE);
                    setSelectedType(ALL_VALUE);
                  }}
                  className="text-blue-700 font-semibold hover:text-blue-800"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="border border-gray-400 p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {job.role_name ? <Chip variant="primary">{job.role_name}</Chip> : null}
                  {job.location_name ? <Chip variant="light">{job.location_name}</Chip> : null}
                  {job.employment_type_name ? (
                    <Chip variant="secondary">{job.employment_type_name}</Chip>
                  ) : null}
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{job.title}</h3>
                <p className="text-sm font-medium text-black leading-6 mb-6">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills?.map((skill) => (
                    <Chip key={skill} variant="light" className="bg-gray-100 text-black">
                      {skill}
                    </Chip>
                  ))}
                </div>
                <Button
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3 rounded-lg"
                  onClick={() => setActiveJob(job)}
                >
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No jobs match the selected filters right now.
            </p>
          ) : null}
        </div>
      </section>

      {activeJob ? <JobApplicationModal job={activeJob} onClose={() => setActiveJob(null)} /> : null}
    </>
  );
}
