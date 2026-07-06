/** Signed, stateless session cookie helpers (HMAC-SHA256 via Web Crypto, Workers-compatible). */

export const SESSION_COOKIE = 'dynamic_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  id: number;
  login: string;
  avatar: string;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  const bin = atob(withPadding);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

/** Sign a session payload into an opaque cookie value. */
export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify({ ...payload, exp })));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const sig = toBase64Url(new Uint8Array(signature));
  return `${body}.${sig}`;
}

/** Verify a cookie value and return its payload, or null if missing/invalid/expired. */
export async function verifySession(
  value: string | undefined,
  secret: string
): Promise<SessionPayload | null> {
  if (!value) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    fromBase64Url(sig),
    new TextEncoder().encode(body)
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload & {
      exp: number;
    };
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { id: payload.id, login: payload.login, avatar: payload.avatar };
  } catch {
    return null;
  }
}
