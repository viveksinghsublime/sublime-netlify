import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { createJobPosting, listAdminJobs } from '@/lib/server/jobs';
import { revalidateJobContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    requireAdminRequest(request);
    const records = await listAdminJobs();
    return jsonSuccess(records, 'Job postings fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: [] });
  }
}

export async function POST(request) {
  try {
    requireAdminRequest(request);
    const payload = await readJsonBody(request);
    const record = await createJobPosting(payload);
    revalidateJobContent();
    return jsonSuccess(record, 'Job posting created successfully.', 201);
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

