import { listPublishedJobs } from '@/lib/server/jobs';
import { jsonError, jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const jobs = await listPublishedJobs();
    return jsonSuccess(jobs, 'Jobs fetched successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to fetch jobs.', 500, { data: [] });
  }
}

