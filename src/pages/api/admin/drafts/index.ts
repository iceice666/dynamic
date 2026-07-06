import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getOwnerSession } from '$/utils/adminAuth';
import { createDraft } from '$/utils/drafts';

/** Creates a blank draft and redirects to its editor (plain-form target, no client JS required). */
export const POST: APIRoute = async (context) => {
  const session = await getOwnerSession(context);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const draft = await createDraft(env.DRAFTS);
  return context.redirect(`/admin/edit/${draft.id}/`, 303);
};
