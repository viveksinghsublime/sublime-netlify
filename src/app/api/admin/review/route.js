import { requireAdminRequest, jsonError, jsonSuccess } from '@/lib/server/api';
import { createReview, listAdminReviews } from '@/lib/server/reviews';
import { revalidateReviewContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    requireAdminRequest(request);
    const records = await listAdminReviews();
    return jsonSuccess(records, 'Reviews fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: [] });
  }
}

export async function POST(request) {
  try {
    requireAdminRequest(request);
    const formData = await request.formData();
    const record = await createReview(formData);
    revalidateReviewContent();
    return jsonSuccess(record, 'Review created successfully.', 201);
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

