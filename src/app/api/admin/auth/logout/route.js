import { ADMIN_COOKIE_NAME, buildAdminCookieOptions } from '@/lib/server/auth';
import { jsonSuccess } from '@/lib/server/api';

export const runtime = 'nodejs';

export async function POST() {
  const response = jsonSuccess(null, 'Logged out successfully.');
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    ...buildAdminCookieOptions(),
    maxAge: 0,
  });
  return response;
}

