import { listPublishedReviews } from '@/lib/server/reviews';
import { jsonError, jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const reviews = await listPublishedReviews();
    return jsonSuccess(reviews, 'Reviews fetched successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to fetch reviews.', 500, { data: [] });
  }
}

