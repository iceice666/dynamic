import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { site } from '#/dynamic.config';
import { parseArticleId, formatDate, entrySlug } from '../utils';

export const prerender = true;

export async function GET(context: any) {
  const postsRaw = await getCollection('posts');
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const postsWithMeta = await Promise.all(
    postsRaw.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post);
      const publishedAt: Date =
        post.data.publishedAt ?? remarkPluginFrontmatter?.publishedAt ?? new Date();
      return { post, publishedAt };
    })
  );

  // Filter for default language (en) to avoid duplicates in mixed-language feeds
  // You can customize this logic to support multiple feeds (e.g. /zh-tw/rss.xml) if needed
  const defaultLang = 'en';

  const validArticles = articles.filter((article) => {
    const { lang: fileLang } = parseArticleId(article.id);
    const lang = fileLang ?? article.data.lang ?? defaultLang;
    return lang === defaultLang;
  });

  // Combine and sort by date
  const allItems = [
    ...postsWithMeta.map(({ post, publishedAt }) => ({
      title: `Post ${formatDate(publishedAt)}`,
      pubDate: publishedAt,
      description: '',
      link: `/posts/${entrySlug(post.id)}/`,
    })),
    ...validArticles.map((article) => {
      const { slug } = parseArticleId(article.id);
      return {
        title: article.data.title ?? 'Untitled',
        pubDate: article.data.publishedAt,
        description: article.data.description ?? '',
        // Compute link: /articles/[slug]
        link: `/articles/${slug}/`,
      };
    }),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: allItems,
    customData: `<language>en-us</language>`,
  });
}
