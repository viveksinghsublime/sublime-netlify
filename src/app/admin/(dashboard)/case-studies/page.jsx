import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import {
  listAdminCaseStudies,
  listCaseStudyCategories,
  listCaseStudySubcategories,
} from '@/lib/server/caseStudies';

const CaseStudyList = dynamic(() => import('@/components/admin/CaseStudyList'), {
  loading: () => <AdminModuleSkeleton />,
});

export default async function AdminCaseStudiesPage() {
  const [caseStudies, categories, subcategories] = await Promise.all([
    listAdminCaseStudies().catch(() => []),
    listCaseStudyCategories().catch(() => []),
    listCaseStudySubcategories().catch(() => []),
  ]);

  return (
    <CaseStudyList
      caseStudies={caseStudies}
      categories={categories}
      subcategories={subcategories}
    />
  );
}
