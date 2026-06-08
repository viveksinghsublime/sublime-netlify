import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listAdminReviews } from '@/lib/server/reviews';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminReviewsPage() {
  const records = await listAdminReviews().catch(() => []);

  const fields = [
    { name: 'name', label: 'Reviewer Name', required: true },
    { name: 'position', label: 'Position / Company' },
    { name: 'message', label: 'Message', required: true, type: 'textarea', rows: 5 },
    { name: 'image', label: 'Image', type: 'file', accept: '.jpg,.jpeg,.png,.webp,.gif', hideInTable: true },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  return (
    <CrudManager
      title="Reviews"
      description="Manage the reviews used in the homepage testimonial section."
      endpoint="/api/admin/review"
      fields={fields}
      initialItems={records}
      createLabel="Add Review"
      searchPlaceholder="Search by reviewer name, company, or message"
    />
  );
}
