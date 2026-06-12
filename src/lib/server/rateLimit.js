import { getOne, query } from '@/lib/server/db';
import { ensureDatabaseSetup } from '@/lib/server/schema';
import { normalizeWhitespace } from '@/lib/server/utils';

function getWindowConfig() {
  const rawEnabledValue = String(process.env.CONTACT_RATE_LIMIT_ENABLED || '').trim().toLowerCase();
  const isEnabled =
    rawEnabledValue === ''
      ? process.env.NODE_ENV === 'production'
      : !['0', 'false', 'no', 'off'].includes(rawEnabledValue);

  return {
    isEnabled,
    maxRequests: Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
    windowSeconds: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS || 3600),
  };
}

export async function enforceRateLimit(keyName, identifier) {
  await ensureDatabaseSetup();

  const normalizedKey = normalizeWhitespace(keyName);
  const normalizedIdentifier = normalizeWhitespace(identifier || 'unknown');
  const { isEnabled, maxRequests, windowSeconds } = getWindowConfig();

  if (!isEnabled) {
    return {
      allowed: true,
      remaining: null,
      disabled: true,
    };
  }

  const now = new Date();

  const existing = await getOne(
    'SELECT id, request_count, window_start FROM request_rate_limits WHERE key_name = ? AND identifier = ? LIMIT 1',
    [normalizedKey, normalizedIdentifier]
  );

  if (!existing) {
    await query(
      'INSERT INTO request_rate_limits (key_name, identifier, request_count, window_start) VALUES (?, ?, 1, ?)',
      [normalizedKey, normalizedIdentifier, now]
    );

    return {
      allowed: true,
      remaining: Math.max(maxRequests - 1, 0),
    };
  }

  const windowStart = new Date(existing.window_start);
  const elapsedSeconds = Math.floor((now.getTime() - windowStart.getTime()) / 1000);

  if (elapsedSeconds >= windowSeconds) {
    await query(
      'UPDATE request_rate_limits SET request_count = 1, window_start = ? WHERE id = ?',
      [now, existing.id]
    );

    return {
      allowed: true,
      remaining: Math.max(maxRequests - 1, 0),
    };
  }

  const currentCount = Number(existing.request_count || 0);
  if (currentCount >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(windowSeconds - elapsedSeconds, 1),
    };
  }

  const nextCount = currentCount + 1;
  await query('UPDATE request_rate_limits SET request_count = ? WHERE id = ?', [nextCount, existing.id]);

  return {
    allowed: true,
    remaining: Math.max(maxRequests - nextCount, 0),
  };
}
