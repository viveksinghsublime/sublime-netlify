'use client';

import { useState } from 'react';
import { Eye, EyeOff, KeyRound, LoaderCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';

const inputClassName =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggleVisibility,
  autoComplete,
}) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClassName} pr-11`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

export default function AdminProfileModal({ open, onClose, userName, userEmail }) {
  const [formState, setFormState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  function resetState() {
    setFormState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setVisibleFields({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
    setErrorMessage('');
    setSuccessMessage('');
  }

  function toggleVisibility(field) {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to update password.');
        return;
      }

      setSuccessMessage(payload.message || 'Password updated successfully.');
      setFormState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      setErrorMessage('Something went wrong while updating the password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 px-4 py-6">
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Profile Settings</h2>
              <p className="mt-2 text-sm text-slate-600">
                Update the password for {userName || 'your admin account'}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close profile modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{userName || 'Admin User'}</p>
            <p className="mt-1 text-sm text-slate-500">{userEmail}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <PasswordField
              id="currentPassword"
              label="Current Password"
              value={formState.currentPassword}
              onChange={(value) => updateField('currentPassword', value)}
              visible={visibleFields.currentPassword}
              onToggleVisibility={() => toggleVisibility('currentPassword')}
              autoComplete="current-password"
            />

            <PasswordField
              id="newPassword"
              label="New Password"
              value={formState.newPassword}
              onChange={(value) => updateField('newPassword', value)}
              visible={visibleFields.newPassword}
              onToggleVisibility={() => toggleVisibility('newPassword')}
              autoComplete="new-password"
            />

            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={formState.confirmPassword}
              onChange={(value) => updateField('confirmPassword', value)}
              visible={visibleFields.confirmPassword}
              onToggleVisibility={() => toggleVisibility('confirmPassword')}
              autoComplete="new-password"
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Use at least 8 characters with uppercase, lowercase, a number, and a special character.
            </div>

            {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm font-medium text-emerald-600">{successMessage}</p> : null}

            <div className="mt-2 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl border border-slate-300"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl px-5" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
