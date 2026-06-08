import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { listCaseStudyCategories, listCaseStudySubcategories } from '@/lib/server/caseStudies';

const CaseStudyForm = dynamic(() => import('@/components/admin/CaseStudyForm'), {
  loading: () => <AdminModuleSkeleton variant="form" />,
});

export default async function NewCaseStudyPage() {
  const [categories, subcategories] = await Promise.all([
    listCaseStudyCategories().catch(() => []),
    listCaseStudySubcategories().catch(() => []),
  ]);

  return <CaseStudyForm categories={categories} subcategories={subcategories} />;
}
