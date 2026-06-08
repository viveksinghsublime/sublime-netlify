import { requireAdminRequest, jsonError, jsonSuccess } from '@/lib/server/api';
import { getReviewById, softDeleteReview, updateReview } from '@/lib/server/reviews';
import { revalidateReviewContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getReviewById(Number(resolvedParams.id));
    if (!record) {
      return jsonError('Review not found.', 404, { data: null });
    }
    return jsonSuccess(record, 'Review fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const formData = await request.formData();
    const record = await updateReview(Number(resolvedParams.id), formData);
    revalidateReviewContent();
    return jsonSuccess(record, 'Review updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    await softDeleteReview(Number(resolvedParams.id));
    revalidateReviewContent();
    return jsonSuccess(null, 'Review deleted successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
