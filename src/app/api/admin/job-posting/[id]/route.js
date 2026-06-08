import { requireAdminRequest, jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { getJobById, softDeleteJobPosting, updateJobPosting } from '@/lib/server/jobs';
import { revalidateJobContent } from '@/lib/server/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const record = await getJobById(Number(resolvedParams.id));
    if (!record) {
      return jsonError('Job posting not found.', 404, { data: null });
    }
    return jsonSuccess(record, 'Job posting fetched successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 500, { data: null });
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    const payload = await readJsonBody(request);
    const record = await updateJobPosting(Number(resolvedParams.id), payload);
    revalidateJobContent();
    return jsonSuccess(record, 'Job posting updated successfully.');
  } catch (error) {
    return jsonError(error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message, error.message === 'UNAUTHORIZED' ? 401 : 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdminRequest(request);
    const resolvedParams = await params;
    await softDeleteJobPosting(Number(resolvedParams.id));
    revalidateJobContent();
    return jsonSuccess(null, 'Job posting deleted successfully.');
  } catch (error) {
    return jsonError(
      error.message === 'UNAUTHORIZED' ? 'Unauthorized.' : error.message,
      error.message === 'UNAUTHORIZED' ? 401 : 500
    );
  }
}
