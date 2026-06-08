'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { validateAdminLoginForm } from '@/lib/validation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const validationMessage = validateAdminLoginForm(formState);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to log in.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while trying to log in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl bg-white p-8 shadow-xl">
      <InputField
        id="admin-email"
        name="email"
        type="email"
        label="Admin Email"
        required
        value={formState.email}
        onChange={handleChange}
      />
      <InputField
        id="admin-password"
        name="password"
        type="password"
        label="Password"
        required
        value={formState.password}
        onChange={handleChange}
      />

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <Button type="submit" className="rounded-xl py-3" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
