import { buildAdminCookieOptions, createAdminSessionValue, verifyPassword, ADMIN_COOKIE_NAME } from '@/lib/server/auth';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/server/api';
import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne } from '@/lib/server/db';
import { isValidEmail } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await ensureDatabaseSetup();
    const payload = await readJsonBody(request);
    const email = String(payload.email || '').trim();
    const password = String(payload.password || '');

    if (!email || !password) {
      return jsonError('Email and password are required.', 400);
    }
    if (!isValidEmail(email)) {
      return jsonError('Enter a valid email address.', 400);
    }

    const adminUser = await getOne(
      'SELECT id, name, email, password_hash, status FROM admin_users WHERE email = ? AND status = 1 LIMIT 1',
      [email]
    );

    if (!adminUser || !(await verifyPassword(password, adminUser.password_hash))) {
      return jsonError('Invalid email or password.', 401);
    }

    const response = jsonSuccess(
      { id: adminUser.id, email: adminUser.email, name: adminUser.name },
      'Login successful.'
    );
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionValue(adminUser), buildAdminCookieOptions());
    return response;
  } catch (error) {
    return jsonError(error.message || 'Failed to log in.', 500);
  }
}
