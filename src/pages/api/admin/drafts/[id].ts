import type { APIRoute } from 'astro';
import { getOwnerSession } from '$/utils/adminAuth';
import { getDraft, saveDraft, deleteDraft, type Draft } from '$/utils/drafts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = async (context) => {
  const session = await getOwnerSession(context);
  if (!session) return json({ error: 'Unauthorized' }, 401);

  const draft = await getDraft(context.locals.runtime.env.DRAFTS, context.params.id!);
  if (!draft) return json({ error: 'Not found' }, 404);
  return json(draft);
};

export const PUT: APIRoute = async (context) => {
  const session = await getOwnerSession(context);
  if (!session) return json({ error: 'Unauthorized' }, 401);

  const kv = context.locals.runtime.env.DRAFTS;
  const existing = await getDraft(kv, context.params.id!);
  if (!existing) return json({ error: 'Not found' }, 404);

  const body = await context.request.json();
  const updated: Draft = {
    ...existing,
    title: String(body.title ?? ''),
    description: body.description ? String(body.description) : undefined,
    category: body.category ? String(body.category) : undefined,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    lang: String(body.lang || 'en'),
    body: String(body.body ?? ''),
    updatedAt: new Date().toISOString(),
  };
  await saveDraft(kv, updated);
  return json(updated);
};

export const DELETE: APIRoute = async (context) => {
  const session = await getOwnerSession(context);
  if (!session) return json({ error: 'Unauthorized' }, 401);

  await deleteDraft(context.locals.runtime.env.DRAFTS, context.params.id!);
  return new Response(null, { status: 204 });
};
