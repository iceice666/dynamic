# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321 (hot reload)
pnpm build      # Build static site to ./dist/
pnpm preview    # Preview production build locally
pnpm check      # Type-check (astro check) + lint + format check
pnpm lint       # ESLint check only
pnpm lint:fix   # Auto-fix lint issues
pnpm format     # Auto-format with Prettier
```

## Architecture

> Astro 5 docs: https://docs.astro.build/llms.txt

**Astro 5 blog** deployed to Cloudflare Pages (`output: 'server'` with `@astrojs/cloudflare` adapter).

### Path Alias

`$` maps to `src/` (configured in `tsconfig.json`). Use `$/…` for all imports within `src/` (e.g., `import { t } from '$/i18n'`). Files outside `src/` (root-level `dynamic.config.ts`, `styles/`, `assets/`) use relative paths.

### Project Structure

```
├── assets/                  # Static assets (images, SVGs)
├── styles/                  # Global CSS (Tailwind entry + article styles)
│   ├── global.css           # Entry point: @import tailwindcss + all partials
│   ├── theme.css            # OKLCH color tokens + dark mode + --accent-hue
│   ├── typography.css       # Font families and base text styles
│   ├── components.css       # Cards, buttons, code block UI
│   └── article.css          # Prose layout and article-specific styles
├── dynamic.config.ts        # Site config: author profile, friends list, Giscus, Umami
├── content/                 # Markdown collections (articles/, posts/)
└── src/
    ├── components/
    │   ├── nav/             # LeftNav, LeftNavList, BottomNav, BottomNavList
    │   ├── toc/             # TOCWidget, TOCObserver, BottomNavTOC
    │   ├── cards/           # ArticleCard, PostCard, AuthorBio, FriendCard
    │   ├── controls/        # ThemeButton, LanguageToggle
    │   ├── widgets/         # VisitCounter, ArticleViewCount (Umami-backed)
    │   ├── GiscusComments.tsx
    │   ├── I18nText.astro   # Dual-span i18n text utility
    │   ├── SearchPage.tsx   # Client-side full-text search
    │   └── withStrictMode.tsx  # HOC: wraps React components in <StrictMode>
    ├── content.config.ts    # Astro content collection schemas (articles + posts)
    ├── i18n/
    │   ├── ui.ts            # Static translation dictionary (en, zh-tw)
    │   ├── index.ts         # t(), i18nAriaLabel(), re-exports
    │   └── useLocale.ts     # React hook: reads locale from dataset.lang reactively
    ├── layouts/
    │   └── BaseLayout.astro # 2-col grid, dark mode FOUC prevention, view transitions
    ├── pages/               # File-based routes (index, articles/[slug], posts/[id], etc.)
    │   └── api/
    │       └── visit-count.ts  # Umami analytics proxy endpoint
    ├── types.ts             # SocialLink, Friend, Author types
    ├── utils.ts             # entrySlug(), formatDate()
    └── utils/               # Custom remark/rehype plugins
        ├── admonitions.ts          # :::note/tip/warning/danger directive blocks
        ├── codeBlockTransformer.ts # Shiki transformer: lang label + copy button
        ├── remarkContentExtractor.ts # Extracts title/description from markdown body
        ├── remarkWordCount.ts      # Word count + reading time in frontmatter
        └── social.ts               # socialHref(), socialIcon() for SocialLink types
```

### Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind` — incompatible with v4).
- Design tokens in `styles/theme.css` using OKLCH colors. The `--accent-hue` CSS variable (0–360) drives the accent color; users can change it via ThemeButton.
- Dark mode via `html.dark` class, applied by a blocking inline script in `BaseLayout.astro` to prevent FOUC.
- Rainbow mode: `html.rainbow-active` animates `--accent-hue` continuously; speed is controlled by `--rainbow-duration`.

### React Islands

React components (`.tsx`) run client-side. All are wrapped with `withStrictMode()` HOC before mounting. Key islands:
- `ThemeButton` — dark/light/system toggle + accent hue slider + rainbow mode; persists to `localStorage` under `dynamic:theme`, `dynamic:accent-hue`, `dynamic:rainbow-mode`, `dynamic:rainbow-speed`
- `TOCObserver` — IntersectionObserver-based TOC active-heading highlighting
- `LanguageToggle` — switches locale, updates `localStorage` + `document.documentElement.dataset.lang`
- `SearchPage` — fetches `/search-index.json` (cached module-level), supports `#tag` and `@category` syntax
- `VisitCounter` / `ArticleViewCount` — fetch `/api/visit-count` (Umami proxy)
- `GiscusComments` — GitHub Discussions; disabled if `giscus.repo` is empty in `dynamic.config.ts`

### i18n

- Locales: `en` (default, no URL prefix) and `zh-tw` (prefix `/zh-tw/`).
- Configured in `astro.config.mjs` via Astro's built-in `i18n` option.
- Static translations live in `src/i18n/ui.ts`. Access them:
  - **Astro components:** `t(key)` returns `{ en, 'zh-tw' }` for dual-span rendering via `<I18nText>`.
  - **React islands:** `useTranslation()` hook reads `document.documentElement.dataset.lang` reactively.
  - **aria-labels:** `i18nAriaLabel(key)` returns `{ 'aria-label', 'data-aria-en', 'data-aria-zh-tw' }`.

### Content

- Articles live in `content/articles/`, posts in `content/posts/`. Both are Markdown; MDX is supported.
- Entry IDs include the `.md` extension — always use `entrySlug(entry.id)` from `src/utils.ts` to strip it for URL generation.
- Content schema fields: `title`, `description`, `category`, `categoryName`, `tags`, `publishedAt`, `draft`, `lang`, `translationOf`. Title and description can be omitted and auto-extracted from markdown body by `remarkContentExtractor`.

### Markdown Pipeline

Custom remark/rehype plugins in `astro.config.mjs`:
- `remarkAdmonitions` — `:::note`, `:::tip`, `:::warning`, `:::danger` directive blocks
- `remarkContentExtractor` — auto-extracts first `h1` as title and first paragraph as description
- `remarkWordCount` — stores `wordCount` and `readingTime` in frontmatter (CJK + Latin word counting)
- `codeBlockTransformer` — Shiki transformer adding language label and copy button to code blocks
- `remark-math` + `rehype-katex` — LaTeX math rendering
- `rehype-accessible-emojis` — wraps emoji characters with `<span role="img">`

### Deployment

- **CI:** `.github/workflows/ci.yml` runs `pnpm check` + `pnpm build` on push/PR.
- **Deploy:** `.github/workflows/deploy.yml` deploys on the `publish` branch (production) and creates PR previews.
- **Required secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Umami analytics:** configured via env vars `UMAMI_API_URL`, `UMAMI_WEBSITE_ID`, `UMAMI_API_KEY`.
