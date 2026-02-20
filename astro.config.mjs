import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
})();
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFigure from 'rehype-figure';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { remarkAdmonitions } from './src/utils/admonitions.ts';
import { remarkSpoiler } from './src/utils/remarkSpoiler.ts';
import { remarkContentExtractor } from './src/utils/remarkContentExtractor.ts';
import { remarkWordCount } from './src/utils/remarkWordCount.ts';
import { remarkPostMeta } from './src/utils/remarkPostMeta.ts';
import { remarkBanHeaders } from './src/utils/remarkBanHeaders.ts';
import remarkBreaks from 'remark-breaks';
import { codeBlockTransformer } from './src/utils/codeBlockTransformer.ts';

import sitemap from '@astrojs/sitemap';
import { site } from './dynamic.config.ts';

export default defineConfig({
  output: 'server',
  srcDir: './src',
  site: site.url,
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              sources: (filename) => !filename.includes('GiscusComments'),
            },
          ],
        ],
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    define: {
      __GIT_HASH__: JSON.stringify(gitHash),
    },
    plugins: [tailwindcss(), visualizer({ emitFile: true, filename: 'stats.html' })],
    resolve: {
      alias: { '#': new URL('.', import.meta.url).pathname },
      dedupe: ['react', 'react-dom', 'react-dom/server'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-tw'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkAdmonitions,
      remarkEmoji,
      remarkSpoiler,
      remarkContentExtractor,
      remarkPostMeta,
      remarkWordCount,
      remarkBreaks,
      remarkBanHeaders,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['anchor-link'],
            ariaHidden: 'true',
            tabIndex: -1,
          },
          content: {
            type: 'element',
            tagName: 'svg',
            properties: {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '0.75em',
              height: '0.75em',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
                },
                children: [],
              },
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
                },
                children: [],
              },
            ],
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noopener', 'noreferrer'],
        },
      ],
      rehypeFigure,
      rehypeUnwrapImages,
      rehypeKatex,
      rehypeAccessibleEmojis,
    ],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [codeBlockTransformer()],
    },
  },
});
