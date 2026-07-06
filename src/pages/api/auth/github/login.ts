import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies, redirect, locals }) => {
  const { GITHUB_CLIENT_ID: clientId } = locals.runtime.env;
  if (!clientId) {
    return new Response('GitHub OAuth is not configured', { status: 503 });
  }

  const state = crypto.randomUUID();
  cookies.set('github_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/github/callback/`);
  authorizeUrl.searchParams.set('scope', 'read:user');
  authorizeUrl.searchParams.set('state', state);

  return redirect(authorizeUrl.toString());
};
