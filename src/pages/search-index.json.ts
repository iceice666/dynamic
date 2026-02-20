import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { parseArticleId, formatCategory } from '$/utils';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).map((entry) => {
    const { slug, lang: fileLang } = parseArticleId(entry.id);
    return {
      type: 'article' as const,
      slug,
      title: entry.data.title,
      description: entry.data.description ?? '',
      tags: entry.data.tags,
      publishedAt: entry.data.publishedAt.toISOString(),
      category: entry.data.category ?? '',
      categoryName: entry.data.category ? formatCategory(entry.data.category) : '',
      lang: fileLang ?? entry.data.lang,
      body: entry.body ?? '',
    };
  });

  const postsRaw = await getCollection('posts');
  const posts = await Promise.all(
    postsRaw.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        type: 'post' as const,
        slug: parseArticleId(entry.id).slug,
        title: '',
        description: '',
        tags: entry.data.tags ?? remarkPluginFrontmatter?.tags ?? [],
        publishedAt: (
          entry.data.publishedAt ??
          remarkPluginFrontmatter?.publishedAt ??
          new Date()
        ).toISOString(),
        category: '',
        categoryName: '',
        body: entry.body ?? '',
      };
    })
  );

  const index = [...articles, ...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
