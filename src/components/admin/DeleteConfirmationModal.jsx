'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DeleteConfirmationModal({
  title = 'Delete Record',
  message = 'Are you sure you want to delete this record?',
  confirmLabel = 'Delete',
  isDeleting = false,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 px-4 py-4 sm:py-6">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm leading-6 text-slate-600">{message}</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl border border-slate-300"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              className="rounded-xl"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
