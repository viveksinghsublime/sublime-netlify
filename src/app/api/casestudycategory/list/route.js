import { listCaseStudyCategories } from '@/lib/server/caseStudies';
import { jsonError, jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const categories = await listCaseStudyCategories();
    return jsonSuccess(categories, 'Case study categories fetched successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to fetch case study categories.', 500, { data: [] });
  }
}

