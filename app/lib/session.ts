import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
  SESSION_DAYS,
  type SessionUser,
} from '@/app/lib/session-token';

export {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
  SESSION_DAYS,
  type SessionUser,
} from '@/app/lib/session-token';

export async function createSession(user: SessionUser) {
  const token = await encodeSession(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    // http://localhost needs secure:false; HTTPS production must be secure
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  return session;
}

export async function requireUserId() {
  const session = await requireUser();
  return session.userId;
}
