import { getRequestIp, readJsonBody, jsonError, jsonSuccess } from '@/lib/server/api';
import { submitContactLead } from '@/lib/server/contact';
import { enforceRateLimit } from '@/lib/server/rateLimit';
import { verifyTurnstileToken } from '@/lib/server/turnstile';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const payload = await readJsonBody(request);
    const honeypotValue = String(payload.secondary_email || '').trim();
    if (honeypotValue) {
      return jsonSuccess(null, 'Contact details added successfully.');
    }

    const ipAddress = getRequestIp(request);
    const rateLimit = await enforceRateLimit('contact_form', ipAddress);
    if (!rateLimit.allowed) {
      return jsonError('Too many contact form submissions. Please try again later.', 429, {
        retryAfterSeconds: rateLimit.retryAfterSeconds || null,
      });
    }

    const verification = await verifyTurnstileToken(payload.turnstileToken, ipAddress);
    const expectedHostname = String(process.env.TURNSTILE_EXPECTED_HOSTNAME || '').trim();

    if (!verification.success) {
      return jsonError('Verification failed. Please try again.', 403);
    }

    if (expectedHostname && verification.hostname !== expectedHostname) {
      return jsonError('Verification failed. Please try again.', 403);
    }

    await submitContactLead(payload);
    return jsonSuccess(null, 'Contact details added successfully.');
  } catch (error) {
    return jsonError(error.message || 'Failed to submit contact details.', error.statusCode || 400);
  }
}
