import { requireAdminRequest, jsonError, jsonSuccess } from '@/lib/server/api';
import { createCaseStudy, listAdminCaseStudies, getCaseStudySlug } from '@/lib/server/caseStudies';
import { revalidateCaseStudyContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    requireAdminRequest(request);
    const records = await listAdminCaseStudies();
    return jsonSuccess(records, 'Case studies fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: [] });
  }
}

export async function POST(request) {
  try {
    requireAdminRequest(request);
    const formData = await request.formData();
    const record = await createCaseStudy(formData);
    revalidateCaseStudyContent(record ? `/works/${getCaseStudySlug(record)}` : undefined);
    return jsonSuccess(record, 'Case study created successfully.', 201);
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

