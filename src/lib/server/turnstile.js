import { normalizeWhitespace } from '@/lib/server/utils';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token, ipAddress = '') {
  const secretKey = normalizeWhitespace(process.env.TURNSTILE_SECRET_KEY);
  const normalizedToken = normalizeWhitespace(token);

  if (!secretKey) {
    const error = new Error('Turnstile secret key is missing.');
    error.statusCode = 500;
    throw error;
  }

  if (!normalizedToken) {
    return {
      success: false,
      errorCodes: ['missing-input-response'],
      hostname: '',
    };
  }

  const payload = new URLSearchParams({
    secret: secretKey,
    response: normalizedToken,
  });

  if (ipAddress) {
    payload.set('remoteip', ipAddress);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = new Error('Turnstile verification request failed.');
    error.statusCode = 502;
    throw error;
  }

  const result = await response.json();
  return {
    success: Boolean(result?.success),
    errorCodes: Array.isArray(result?.['error-codes']) ? result['error-codes'] : [],
    hostname: normalizeWhitespace(result?.hostname),
  };
}
