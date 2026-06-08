import { listPublicCaseStudies } from '@/lib/server/caseStudies';
import { jsonError, jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const caseStudies = await listPublicCaseStudies();
    return jsonSuccess(caseStudies, 'Case studies fetched successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to fetch case studies.', 500, { data: [] });
  }
}

