import { cache } from 'react';
import { listPublishedReviews } from '@/lib/server/reviews';

export const REVIEWS_REVALIDATE_SECONDS = 600;

export const fetchPublishedReviews = cache(async () => {
  try {
    return await listPublishedReviews();
  } catch {
    return [];
  }
});
