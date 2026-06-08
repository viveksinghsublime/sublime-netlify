import crypto from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'sublime_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function base64urlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64urlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || '';
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required for admin authentication.');
  }
  return secret;
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  return `${salt}:${Buffer.from(derivedKey).toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, hash] = storedHash.split(':');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  const hashBuffer = Buffer.from(hash, 'hex');
  return hashBuffer.length === derivedKey.length && crypto.timingSafeEqual(hashBuffer, Buffer.from(derivedKey));
}

function signPayload(serializedPayload) {
  return crypto.createHmac('sha256', sessionSecret()).update(serializedPayload).digest('base64url');
}

export function createAdminSessionValue(adminUser) {
  const payload = {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name || 'Admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const serializedPayload = JSON.stringify(payload);
  const encodedPayload = base64urlEncode(serializedPayload);
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function readAdminSessionValue(sessionValue) {
  if (!sessionValue || !sessionValue.includes('.')) {
    return null;
  }

  const [encodedPayload, signature] = sessionValue.split('.');
  const expectedSignature = signPayload(encodedPayload);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const payload = JSON.parse(base64urlDecode(encodedPayload));
  if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function getAdminSessionFromRequest(request) {
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return readAdminSessionValue(cookieValue);
}

export function getAdminSessionFromCookieStore(cookieStore) {
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return readAdminSessionValue(cookieValue);
}

export function buildAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
