import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    categoryName: z.string().optional(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, posts };
