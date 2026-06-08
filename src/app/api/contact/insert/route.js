import { readJsonBody, jsonError, jsonSuccess } from '@/lib/server/api';
import { submitContactLead } from '@/lib/server/contact';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const payload = await readJsonBody(request);
    await submitContactLead(payload);
    return jsonSuccess(null, 'Contact details added successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to submit contact details.', 400);
  }
}

