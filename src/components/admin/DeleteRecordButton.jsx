'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

export default function DeleteRecordButton({ endpoint, label = 'Delete', onDeleted }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        window.alert(payload.message || 'Unable to delete the record.');
        return;
      }

      if (typeof onDeleted === 'function') {
        onDeleted();
      }

      router.refresh();
    } catch {
      window.alert('Something went wrong while deleting the record.');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size="small"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : label}
      </Button>

      {isConfirmOpen ? (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this record? This action will remove it from the active admin list."
          confirmLabel={label}
          isDeleting={isDeleting}
          onCancel={() => {
            if (!isDeleting) {
              setIsConfirmOpen(false);
            }
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  );
}
