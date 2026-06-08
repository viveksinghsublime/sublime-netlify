import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { createCaseStudySubcategory, listCaseStudySubcategories } from '@/lib/server/caseStudies';
import { revalidateCaseStudyContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    requireAdminRequest(request);
    const records = await listCaseStudySubcategories();
    return jsonSuccess(records, 'Case study subcategories fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: [] });
  }
}

export async function POST(request) {
  try {
    requireAdminRequest(request);
    const payload = await readJsonBody(request);
    const record = await createCaseStudySubcategory(payload);
    revalidateCaseStudyContent();
    return jsonSuccess(record, 'Case study subcategory created successfully.', 201);
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
