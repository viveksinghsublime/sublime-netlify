import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { getMasterById, softDeleteMaster, updateMaster } from '@/lib/server/masters';
import { revalidateJobContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getMasterById('location', Number(resolvedParams.id));
    if (!record) {
      return jsonError('Job location not found.', 404, { data: null });
    }
    return jsonSuccess(record, 'Job location fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const payload = await readJsonBody(request);
    const record = await updateMaster('location', Number(resolvedParams.id), payload);
    revalidateJobContent();
    return jsonSuccess(record, 'Job location updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    await softDeleteMaster('location', Number(resolvedParams.id));
    revalidateJobContent();
    return jsonSuccess(null, 'Job location deleted successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
