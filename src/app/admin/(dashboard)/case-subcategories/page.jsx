import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listCaseStudyCategories, listCaseStudySubcategories } from '@/lib/server/caseStudies';

const CrudManager = dynamic(() => import('@/components/admin/CrudManager'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminCaseSubcategoriesPage() {
  const [categories, subcategories] = await Promise.all([
    listCaseStudyCategories().catch(() => []),
    listCaseStudySubcategories().catch(() => []),
  ]);

  const options = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const fields = [
    { name: 'name', label: 'Subcategory Name', required: true },
    { name: 'cat_id', label: 'Parent Category', required: true, type: 'select', options },
  ];

  return (
    <CrudManager
      title="Case Subcategories"
      description="Manage subcategories that roll up under the main case study taxonomy."
      endpoint="/api/admin/case-subcategory"
      fields={fields}
      initialItems={subcategories}
      createLabel="Create Case Subcategory"
      searchPlaceholder="Search by subcategory name or parent category"
    />
  );
}
