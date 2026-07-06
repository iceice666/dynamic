import type { APIRoute } from 'astro';
import { getOwnerSession } from '$/utils/adminAuth';
import { getDraft, deleteDraft, type Draft } from '$/utils/drafts';
import { commitFile } from '$/utils/githubContent';
import { slugify } from '$/utils/slugify';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** JSON is a valid YAML subset — safe for string/array scalars, but dates must stay unquoted
 * so the content collection's `publishedAt: z.date()` gets a real Date, not a string. */
function buildMarkdown(draft: Draft): string {
  const lines = [`title: ${JSON.stringify(draft.title)}`];
  if (draft.description) lines.push(`description: ${JSON.stringify(draft.description)}`);
  if (draft.category) lines.push(`category: ${JSON.stringify(draft.category)}`);
  lines.push(`tags: ${JSON.stringify(draft.tags)}`);
  lines.push(`publishedAt: ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`draft: false`);
  lines.push(`lang: ${JSON.stringify(draft.lang)}`);
  return `---\n${lines.join('\n')}\n---\n\n${draft.body}\n`;
}

export const POST: APIRoute = async (context) => {
  const session = await getOwnerSession(context);
  if (!session) return json({ error: 'Unauthorized' }, 401);

  const { id } = await context.request.json();
  const kv = context.locals.runtime.env.DRAFTS;
  const draft = await getDraft(kv, String(id ?? ''));
  if (!draft) return json({ error: 'Draft not found' }, 404);
  if (!draft.title.trim()) return json({ error: 'Title is required to publish' }, 400);

  const {
    GITHUB_TOKEN: token,
    GITHUB_REPO: repo,
    GITHUB_BRANCH: branch,
  } = context.locals.runtime.env;
  if (!token || !repo || !branch) {
    return json({ error: 'GitHub publishing is not configured' }, 503);
  }

  const slug = slugify(draft.title);
  const path = `content/articles/${slug}.md`;

  try {
    await commitFile({
      token,
      repo,
      path,
      branch,
      content: buildMarkdown(draft),
      message: `Publish: ${draft.title}`,
    });
  } catch (err) {
    console.error('[admin/publish] commit failed:', err);
    return json({ error: 'Failed to publish to GitHub' }, 502);
  }

  await deleteDraft(kv, draft.id);
  return json({ url: `/articles/${slug}/` });
};
