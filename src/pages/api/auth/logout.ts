import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '$/utils/session';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/');
};
