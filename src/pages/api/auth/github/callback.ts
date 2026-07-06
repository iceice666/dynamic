import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '$/utils/session';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const {
    GITHUB_CLIENT_ID: clientId,
    GITHUB_CLIENT_SECRET: clientSecret,
    GITHUB_OWNER_ID: ownerId,
    SESSION_SECRET: sessionSecret,
  } = env;

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = cookies.get('github_oauth_state')?.value;
  cookies.delete('github_oauth_state', { path: '/' });

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/auth/github/callback/`,
    }),
  });
  if (!tokenRes.ok) {
    return new Response('GitHub token exchange failed', { status: 502 });
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenData.access_token) {
    return new Response('GitHub token exchange failed', { status: 502 });
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'dynamic-blog-admin',
      Accept: 'application/vnd.github+json',
    },
  });
  if (!userRes.ok) {
    return new Response('Failed to fetch GitHub profile', { status: 502 });
  }

  const user = (await userRes.json()) as { id: number; login: string; avatar_url: string };

  // Owner check keyed on the immutable numeric id, not the (mutable) username.
  if (String(user.id) !== String(ownerId)) {
    return new Response('This GitHub account is not authorized to write posts', { status: 403 });
  }

  const value = await signSession(
    { id: user.id, login: user.login, avatar: user.avatar_url },
    sessionSecret
  );
  cookies.set(SESSION_COOKIE, value, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  });

  return redirect('/admin/');
};
