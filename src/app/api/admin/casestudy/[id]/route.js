import { requireAdminRequest, jsonError, jsonSuccess } from '@/lib/server/api';
import {
  getCaseStudyById,
  getCaseStudySlug,
  softDeleteCaseStudy,
  updateCaseStudy,
} from '@/lib/server/caseStudies';
import { revalidateCaseStudyContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getCaseStudyById(Number(resolvedParams.id));

    if (!record) {
      return jsonError('Case study not found.', 404, { data: null });
    }

    return jsonSuccess(record, 'Case study fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const formData = await request.formData();
    const record = await updateCaseStudy(Number(resolvedParams.id), formData);
    revalidateCaseStudyContent(record ? `/works/${getCaseStudySlug(record)}` : undefined);
    return jsonSuccess(record, 'Case study updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const existing = await getCaseStudyById(Number(resolvedParams.id));
    await softDeleteCaseStudy(Number(resolvedParams.id));
    revalidateCaseStudyContent(existing ? `/works/${getCaseStudySlug(existing)}` : undefined);
    return jsonSuccess(null, 'Case study deleted successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
