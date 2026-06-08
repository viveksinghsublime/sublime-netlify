import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import {
  getCaseStudyCategoryById,
  softDeleteCaseStudyCategory,
  updateCaseStudyCategory,
} from '@/lib/server/caseStudies';
import { revalidateCaseStudyContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getCaseStudyCategoryById(Number(resolvedParams.id));
    if (!record) {
      return jsonError('Case study category not found.', 404, { data: null });
    }
    return jsonSuccess(record, 'Case study category fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const payload = await readJsonBody(request);
    const record = await updateCaseStudyCategory(Number(resolvedParams.id), payload);
    revalidateCaseStudyContent();
    return jsonSuccess(record, 'Case study category updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    await softDeleteCaseStudyCategory(Number(resolvedParams.id));
    revalidateCaseStudyContent();
    return jsonSuccess(null, 'Case study category deleted successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
