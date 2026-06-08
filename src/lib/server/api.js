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

