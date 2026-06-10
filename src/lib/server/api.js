import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/server/auth';

export function jsonSuccess(data = null, message = 'OK', status = 200) {
  return NextResponse.json(
    {
      status,
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function jsonError(message = 'Something went wrong.', status = 400, extra = {}) {
  return NextResponse.json(
    {
      status,
      success: false,
      message,
      ...extra,
    },
    { status }
  );
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function requireAdminRequest(request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export function getRequestIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || '';
  }

  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    ''
  );
}
