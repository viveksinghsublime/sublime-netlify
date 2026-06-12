import { execute, getOne } from '@/lib/server/db';
import { hashPassword, verifyPassword } from '@/lib/server/auth';
import { jsonError, jsonSuccess, readJsonBody, requireAdminRequest } from '@/lib/server/api';
import { ensureDatabaseSetup } from '@/lib/server/schema';
import { validateAdminPasswordChangeForm } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await ensureDatabaseSetup();
    const session = requireAdminRequest(request);
    const payload = await readJsonBody(request);

    const validationMessage = validateAdminPasswordChangeForm(payload);
    if (validationMessage) {
      return jsonError(validationMessage, 400);
    }

    const adminUser = await getOne(
      'SELECT id, password_hash FROM admin_users WHERE id = ? AND status = 1 LIMIT 1',
      [session.id]
    );

    if (!adminUser) {
      return jsonError('Admin account not found.', 404);
    }

    const isCurrentPasswordValid = await verifyPassword(payload.currentPassword, adminUser.password_hash);
    if (!isCurrentPasswordValid) {
      return jsonError('Current password is incorrect.', 400);
    }

    const passwordHash = await hashPassword(payload.newPassword);
    await execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [passwordHash, adminUser.id]);

    return jsonSuccess(null, 'Password updated successfully.');
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return jsonError('Unauthorized.', 401);
    }

    return jsonError(error.message || 'Failed to update password.', 500);
  }
}
