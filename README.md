# dynamic

An Astro 5 blog with bilingual support (English + Traditional Chinese), deployed to Cloudflare Workers via SSR.

## Features

- **Markdown pipeline:** admonitions, LaTeX math, syntax highlighting with copy buttons, word count + reading time, auto-extracted titles/descriptions
- **Theming:** OKLCH-based design tokens, dark/light/system modes, per-user accent hue picker, rainbow animation mode
- **i18n:** English (default) and Traditional Chinese (`/zh-tw/` prefix), with client-reactive locale switching
- **Search:** Client-side full-text search with `#tag` and `@category` filter syntax
- **Analytics:** Optional Umami integration (visit counter, per-article view count)
- **Comments:** Optional Giscus (GitHub Discussions) integration
- **Layout:** 2-column desktop (sticky left nav + TOC), bottom nav on mobile

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build to ./dist/
pnpm preview    # Preview production build locally
pnpm check      # Type-check + lint + format check
pnpm lint:fix   # Auto-fix lint issues
pnpm format     # Format with Prettier
```

## Configuration

Edit `dynamic.config.ts` in the project root to set:

- **Author** profile (name, tagline, avatar, social links)
- **Friends** list displayed on the `/friends` page
- **Giscus** (GitHub Discussions comments) — leave `repo: ''` to disable
- **Umami** analytics — configure via environment variables `UMAMI_API_URL`, `UMAMI_WEBSITE_ID`, `UMAMI_API_KEY`

## Content

Add Markdown files to `content/articles/` (long-form) or `content/posts/` (short-form). Frontmatter fields:

| Field | Articles | Posts | Notes |
|---|---|---|---|
| `publishedAt` | required | required | |
| `title` | optional | — | Auto-extracted from first `# h1` if omitted |
| `description` | optional | — | Auto-extracted from first paragraph if omitted |
| `tags` | optional | optional | Array of strings |
| `category` / `categoryName` | optional | — | |
| `draft` | optional | optional | Defaults to `false` |
| `lang` | optional | optional | `en` or `zh-tw`, defaults to `en` |
| `translationOf` | optional | optional | Slug of the original article |

## Deployment (Cloudflare Workers)

Two GitHub Actions workflows are included:

- **CI** (`.github/workflows/ci.yml`): runs `pnpm check` and `pnpm build` on push/PR
- **Deploy** (`.github/workflows/deploy.yml`): deploys on the `publish` branch (production) and creates PR preview deployments

Required GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

To set up the production branch:

```bash
git checkout -b publish
git push -u origin publish
```

PR previews deploy to worker names like `dynamic-pr-<PR number>`.
