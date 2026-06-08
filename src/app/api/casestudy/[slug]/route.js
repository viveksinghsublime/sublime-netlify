import { getCaseStudyById, getCaseStudyBySlug } from '@/lib/server/caseStudies';
import { jsonError, jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
    const caseStudy = /^\d+$/.test(slug) ? await getCaseStudyById(Number(slug)) : await getCaseStudyBySlug(slug);

    if (!caseStudy) {
      return jsonError('Case study not found.', 404, { data: null });
    }

    return jsonSuccess(caseStudy, 'Case study fetched successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to fetch case study.', 500, { data: null });
  }
}

