# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321 (hot reload)
pnpm build      # Build static site to ./dist/
pnpm preview    # Preview production build locally
pnpm check      # Type-check + lint + format check
pnpm lint:fix   # Auto-fix lint issues
pnpm format     # Auto-format with Prettier
```

## Architecture

> Astro 5 docs: https://docs.astro.build/llms.txt

**Astro 5 blog** deployed to Cloudflare Pages (`output: 'server'` with `@astrojs/cloudflare` adapter).

### Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind` — incompatible with v4).
- Design tokens defined in `src/styles/global.css` using OKLCH colors with a configurable `--accent-hue` CSS custom property.
- Dark mode via `html.dark` class, applied by a blocking inline script in `BaseLayout.astro` to prevent FOUC.

### React Islands

React components (`.tsx`) run client-side via `client:load` or `client:idle` directives:
- `ThemeButton` — dark/light/system toggle + accent hue picker + rainbow mode
- `TOCObserver` — IntersectionObserver-based table of contents highlighting
- `SearchPage`, `LanguageToggle`, `LeftNavList`, `BottomNavList`, `BottomNavTOC`

### i18n

- Locales: `en` (default, no URL prefix) and `zh-tw` (prefix `/zh-tw/`).
- Configured in `astro.config.mjs` via Astro's built-in `i18n` option.
- Static translations live in `src/i18n/ui.ts`. Access them:
  - **Astro components:** `t(key)` from `src/i18n/index.ts` returns `{ en, 'zh-tw' }` for dual-span rendering via `I18nText.astro`.
  - **React islands:** `useTranslation()` hook from `src/i18n/useLocale.ts` reads locale from `document.documentElement.dataset.lang` reactively.

### Content

- Articles and posts are Markdown/MDX files under `src/content/articles/` and `src/content/posts/`.
- Entry IDs include the `.md` extension — always use `entrySlug(entry.id)` from `src/utils.ts` to strip it for URL generation.

### Markdown Pipeline

Custom remark/rehype plugins configured in `astro.config.mjs`:
- `remarkAdmonitions` (`src/utils/admonitions.ts`) — custom directive-based admonition blocks
- `remarkContentExtractor` (`src/utils/remarkContentExtractor.ts`) — extracts title/description from markdown body
- `codeBlockTransformer` (`src/utils/codeBlockTransformer.ts`) — adds language labels and copy buttons to Shiki code blocks
- `remark-math` + `rehype-katex` — LaTeX math rendering

### Layout

`BaseLayout.astro` provides a 2-column layout: left panel (nav + widgets) and main content area. Mobile uses a bottom navigation bar (`BottomNav.astro`).
