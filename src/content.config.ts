import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  loader: glob({ base: './content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    categoryName: z.string().optional(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'zh-tw']).default('en'),
    translationOf: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './content/posts', pattern: '**/*.md' }),
  schema: z.object({
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'zh-tw']).default('en'),
    translationOf: z.string().optional(),
  }),
});

export const collections = { articles, posts };
