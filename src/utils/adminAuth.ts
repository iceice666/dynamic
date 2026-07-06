import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySession, SESSION_COOKIE, type SessionPayload } from '$/utils/session';

/**
 * Verifies the session cookie AND that it belongs to the configured site owner
 * (matched on the immutable numeric GitHub user ID, not the mutable username).
 */
export async function getOwnerSession(
  context: Pick<APIContext, 'cookies'>
): Promise<SessionPayload | null> {
  const { SESSION_SECRET: secret, GITHUB_OWNER_ID: ownerId } = env;
  if (!secret || !ownerId) return null;

  const session = await verifySession(context.cookies.get(SESSION_COOKIE)?.value, secret);
  if (!session || String(session.id) !== String(ownerId)) return null;
  return session;
}
