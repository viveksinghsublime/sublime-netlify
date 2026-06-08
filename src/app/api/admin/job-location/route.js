import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { createMaster, listMasters } from '@/lib/server/masters';
import { revalidateJobContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    requireAdminRequest(request);
    const records = await listMasters('location');
    return jsonSuccess(records, 'Job locations fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: [] });
  }
}

export async function POST(request) {
  try {
    requireAdminRequest(request);
    const payload = await readJsonBody(request);
    const record = await createMaster('location', payload);
    revalidateJobContent();
    return jsonSuccess(record, 'Job location created successfully.', 201);
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
