import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listCaseStudyCategories } from '@/lib/server/caseStudies';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminCaseCategoriesPage() {
  const categories = await listCaseStudyCategories().catch(() => []);

  const fields = [
    { name: 'name', label: 'Category Name', required: true },
    { name: 'url_name', label: 'URL Name', required: true },
  ];

  return (
    <CrudManager
      title="Case Categories"
      description="Manage public case study categories used by the works and detail pages."
      endpoint="/api/admin/case-category"
      fields={fields}
      initialItems={categories}
      createLabel="Create Case Category"
      searchPlaceholder="Search by category name or URL name"
    />
  );
}
