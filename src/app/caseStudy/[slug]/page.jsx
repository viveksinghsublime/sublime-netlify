import { notFound, permanentRedirect } from 'next/navigation';
import {
  fetchCaseStudyDetailById,
  findCaseStudySummaryBySlug,
  getCaseStudyPath,
  parseLegacyCaseStudyParam,
} from '@/lib/caseStudies';

async function resolveLegacyCaseStudy(param) {
  const { id, slug } = parseLegacyCaseStudyParam(param);

  if (id) {
    return fetchCaseStudyDetailById(id);
  }

  if (slug) {
    return findCaseStudySummaryBySlug(slug);
  }

  return null;
}

export default async function LegacyCaseStudyRedirectPage({ params }) {
  const resolvedParams = await params;
  const param = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const study = await resolveLegacyCaseStudy(param);

  if (!study) {
    notFound();
  }

  permanentRedirect(getCaseStudyPath(study));
}
