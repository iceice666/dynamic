import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  loader: glob({
    base: './content/articles',
    pattern: '**/*.md',
    // Preserve dots in filenames so that the {slug}.{lang}.md convention works.
    // Astro's default ID generation passes filenames through github-slugger which
    // removes dots, turning e.g. `example.zh-tw.md` into `examplezh-tw`.
    generateId: ({ entry }) => String(entry).replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    categoryName: z.string().optional(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
    lang: z.string().optional(), // required on base files; omit on translated files ({slug}.{lang}.md)
  }),
});

const posts = defineCollection({
  loader: glob({ base: './content/posts', pattern: '**/*.md' }),
  schema: z.object({
    tags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    draft: z.boolean().default(false),
    lang: z.string().optional(), // required on base files; omit on translated files
  }),
});

export const collections = { articles, posts };
