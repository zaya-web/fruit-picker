export const SESSION_COOKIE = 'farm_session';
export const SESSION_DAYS = 14;

export type SessionUser = {
  userId: number;
  email: string;
  name: string;
};

type SessionPayload = SessionUser & {
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUTH_SECRET environment variable is required in production.',
    );
  }

  // Local/dev only — never used when NODE_ENV=production
  return 'fruit-picker-dev-secret';
}

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(view).toString('base64url');
  }

  let binary = '';
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64url'));
  }

  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad =
    padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getSigningKey() {
  const secretBytes = new TextEncoder().encode(getAuthSecret());
  const digest = await crypto.subtle.digest('SHA-256', secretBytes);
  return crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signPayload(payload: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  );
  return bytesToBase64Url(signature);
}

async function verifySignature(payload: string, signature: string) {
  const key = await getSigningKey();
  return crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(payload),
  );
}

export async function encodeSession(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const body = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = await signPayload(body);
  return `${body}.${signature}`;
}

export async function decodeSession(
  token: string | undefined | null,
): Promise<SessionUser | null> {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  try {
    const valid = await verifySignature(body, signature);
    if (!valid) return null;

    const json = new TextDecoder().decode(base64UrlToBytes(body));
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    if (
      !Number.isFinite(payload.userId) ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}
