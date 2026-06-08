import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminModuleSkeleton from '@/components/admin/AdminModuleSkeleton';
import { getCaseStudyById, listCaseStudyCategories, listCaseStudySubcategories } from '@/lib/server/caseStudies';

const CaseStudyForm = dynamic(() => import('@/components/admin/CaseStudyForm'), {
  loading: () => <AdminModuleSkeleton variant="form" />,
});

export default async function EditCaseStudyPage({ params }) {
  const resolvedParams = await params;
  const [record, categories, subcategories] = await Promise.all([
    getCaseStudyById(Number(resolvedParams.id)).catch(() => null),
    listCaseStudyCategories().catch(() => []),
    listCaseStudySubcategories().catch(() => []),
  ]);

  if (!record) {
    notFound();
  }

  return <CaseStudyForm initialRecord={record} categories={categories} subcategories={subcategories} />;
}
