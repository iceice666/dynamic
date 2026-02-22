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
import preact from '@astrojs/preact';
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
import { remarkCollapsible } from './src/utils/remarkCollapsible.ts';
import { remarkSpoiler } from './src/utils/remarkSpoiler.ts';
import { remarkContentExtractor } from './src/utils/remarkContentExtractor.ts';
import { remarkWordCount } from './src/utils/remarkWordCount.ts';
import { remarkPostMeta } from './src/utils/remarkPostMeta.ts';
import { remarkBanHeaders } from './src/utils/remarkBanHeaders.ts';
import remarkBreaksRaw from 'remark-breaks';
import { codeBlockTransformer } from './src/utils/codeBlockTransformer.ts';

function remarkBreaks() {
  const transform = remarkBreaksRaw();
  return function (tree, file) {
    const filePath = file.history?.[0] ?? '';
    if (filePath.includes('/content/posts/')) {
      transform(tree, file);
    }
  };
}

import sitemap from '@astrojs/sitemap';
import { site } from './dynamic.config.ts';
import { i18n, filterSitemapByDefaultLocale } from 'astro-i18n-aut/integration';

const defaultLocale = 'en';
const locales = {
  en: 'en',
  'zh-tw': 'zh-tw',
};

export default defineConfig({
  output: 'server',
  srcDir: './src',
  site: site.url,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    preact({
      compat: true,
    }),
    mdx(),
    i18n({
      locales,
      defaultLocale,
      exclude: [
        'pages/api/**/*',
        'pages/rss.xml.ts',
        'pages/search-index.json.ts',
        'pages/posts/**/*',
        'pages/typography.astro',
      ],
    }),
    sitemap({
      i18n: { locales, defaultLocale },
      filter: (page) =>
        filterSitemapByDefaultLocale({ defaultLocale })(page) && !page.includes('/typography'),
    }),
  ],
  vite: {
    define: {
      __GIT_HASH__: JSON.stringify(gitHash),
    },
    plugins: [tailwindcss(), visualizer({ emitFile: true, filename: 'stats.html' })],
    resolve: {
      alias: {
        '#': new URL('.', import.meta.url).pathname,
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkAdmonitions,
      remarkCollapsible,
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
