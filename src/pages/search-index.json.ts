import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { entrySlug } from '$/utils';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).map((entry) => ({
    type: 'article' as const,
    slug: entrySlug(entry.id),
    title: entry.data.title,
    description: entry.data.description ?? '',
    tags: entry.data.tags,
    publishedAt: entry.data.publishedAt.toISOString(),
    category: entry.data.category ?? '',
    categoryName: entry.data.categoryName ?? '',
    lang: entry.data.lang,
    body: (entry.body ?? '').slice(0, 500),
  }));

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).map((entry) => ({
    type: 'post' as const,
    slug: entrySlug(entry.id),
    title: '',
    description: '',
    tags: entry.data.tags,
    publishedAt: entry.data.publishedAt.toISOString(),
    category: '',
    categoryName: '',
    lang: entry.data.lang,
    body: (entry.body ?? '').slice(0, 500),
  }));

  const index = [...articles, ...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
