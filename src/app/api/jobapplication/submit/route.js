import { jsonError, jsonSuccess } from '@/lib/server/api';
import { submitJobApplication } from '@/lib/server/jobs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    await submitJobApplication(formData);
    return jsonSuccess(null, 'Application submitted successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to submit job application.', 400);
  }
}

