import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { getMasterById, softDeleteMaster, updateMaster } from '@/lib/server/masters';
import { revalidateJobContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getMasterById('employmentType', Number(resolvedParams.id));
    if (!record) {
      return jsonError('Employment type not found.', 404, { data: null });
    }
    return jsonSuccess(record, 'Employment type fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const payload = await readJsonBody(request);
    const record = await updateMaster('employmentType', Number(resolvedParams.id), payload);
    revalidateJobContent();
    return jsonSuccess(record, 'Employment type updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    await softDeleteMaster('employmentType', Number(resolvedParams.id));
    revalidateJobContent();
    return jsonSuccess(null, 'Employment type deleted successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}
