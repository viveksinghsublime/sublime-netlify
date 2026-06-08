'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={isSubmitting}>
      {isSubmitting ? 'Signing out...' : 'Logout'}
    </Button>
  );
}

