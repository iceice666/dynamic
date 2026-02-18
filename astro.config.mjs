import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { remarkAdmonitions } from './src/utils/admonitions.ts';
import { remarkContentExtractor } from './src/utils/remarkContentExtractor.ts';
import { remarkWordCount } from './src/utils/remarkWordCount.ts';
import { codeBlockTransformer } from './src/utils/codeBlockTransformer.ts';

export default defineConfig({
  output: 'server',
  srcDir: './src',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]], // try empty config or just string
      },
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
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
      remarkContentExtractor,
      remarkWordCount,
    ],
    rehypePlugins: [rehypeKatex, rehypeAccessibleEmojis],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [codeBlockTransformer()],
    },
  },
});
