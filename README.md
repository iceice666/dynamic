# dynamic

An **Astro 5** blog template designed for performance, aesthetic appeal, and bilingual support (English + Traditional Chinese). Deployed to **Cloudflare Workers** via SSR for edge-speed delivery.

## Tech Stack

Built with cutting-edge web technologies:

- **Framework**: [Astro 5](https://astro.build/) (Server-Side Rendering)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [OKLCH](https://oklch.com/) color space
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **State Management**: [Nano Stores](https://github.com/nanostores/nanostores)

## Features

- 🌍 **Bilingual i18n**: Built-in support for English and Traditional Chinese (other languages welcome PR), with auto-detection and reactive language switching.
- 🎨 **Dynamic Theming**:
  - OKLCH-based design tokens for smooth color mixing.
  - Dark/Light/System modes.
  - User-customizable accent hue picker.
  - "Rainbow" animation mode.
- 📝 **Markdown Powerhouse**:
  - **Syntax Highlighting**: Shiki with copy buttons.
  - **Math Support**: LaTeX equations via KaTeX.
  - **Admonitions**: Custom callout blocks (note, tip, warning, etc.).
  - **Auto-generated Metadata**: Reading time, word count, titles, and descriptions.
- 🔍 **Client-side Search**: Instant full-text search supporting `#tag` and `@category` filters.
- 📊 **Analytics**: Optional **Umami** integration (visit counters, per-page views).
- 💬 **Comments**: Optional **Giscus** (GitHub Discussions) integration.
- 📱 **Responsive Design**:
  - **Desktop**: Sticky left sidebar navigation + Table of Contents (TOC).
  - **Mobile**: Bottom navigation bar + drawer menu.

## Getting Started

### Prerequisites

- **Node.js**: v20 or higher recommended.
- **pnpm**: v9 or higher.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dynamic.git
cd dynamic

# Install dependencies
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
# Server will start at http://localhost:4321
```

## Configuration

The project is configured via `dynamic.config.ts` in the root directory.

### dynamic.config.ts

| Section | Description |
| :--- | :--- |
| **Site** | Metadata like `url`, `title`, and `description` used for SEO, RSS, and the Sitemap. |
| **Author** | Your profile details: `name`, `tagline`, `avatar`, and `socials`. |
| **Friends** | List of friends/links to display on the `/friends` page. |
| **Giscus** | GitHub Discussions comments config. Set `repo: ''` to disable. |
| **Umami** | Analytics configuration (see below). |

### Environment Variables (Umami Analytics)

To enable Umami analytics, create a `.env` file (or set in Cloudflare dashboard) with the following:

```env
# Required for analytics
UMAMI_API_URL="https://analytics.your-domain.com"
UMAMI_WEBSITE_ID="your-website-id-uuid"

# Optional
UMAMI_API_KEY=""       # specific API key if using Umami Cloud
UMAMI_USERNAME=""      # for self-hosted auth
UMAMI_PASSWORD=""      # for self-hosted auth
```

> **Note**: You can set `umami.scriptProxy: true` in `dynamic.config.ts` to proxy the tracking script through your own domain (`/api/uwu.js`) to bypass some ad-blockers.

## Project Structure

```text
├── content/              # Markdown content (live feature reference)
│   ├── articles/         # Long-form articles with full frontmatter support
│   │   └── about-me.md   # Builtin About Me page
│   └── posts/            # Short-form notes (minimal frontmatter)
├── src/
│   ├── components/       # React and Astro components
│   ├── layouts/          # Page layouts (Base, Article, etc.)
│   ├── pages/            # File-based routing (Astro pages & API endpoints)
│   ├── styles/           # Global styles and Tailwind configuration
│   └── utils/            # Helper functions and logic
├── public/               # Static assets (fonts, icons, robots.txt)
├── astro.config.mjs      # Astro configuration
├── dynamic.config.ts     # Project-specific settings
└── package.json          # Dependencies and scripts
```

## Content Management

Content lives in `content/`. The files there serve as a **live reference** — each one demonstrates a real feature of the content system:

| File | Demonstrates |
| :--- | :--- |
| `articles/getting-started.md` + `.zh-tw.md` | Translation pair, standard article frontmatter |
| `articles/markdown-showcase.md` + `.zh-tw.md` | Every markdown feature (GFM, math, admonitions, spoilers, …) |
| `articles/article-frontmatter.md` | All article schema fields with types and explanations |
| `articles/draft-article.md` | `draft: true` behavior |
| `posts/minimal.md` | Post with no frontmatter (date + tags auto-inferred) |
| `posts/hashtag-tags.md` | Tags extracted from trailing `#tag #tag` line |
| `posts/with-frontmatter.md` | Explicit `publishedAt` + `tags` in post frontmatter |

For the full content reference, read those files directly or visit `/articles/getting-started` on the running site.

## Deployment

The site is optimized for **Cloudflare Workers**.

### GitHub Actions

The repository includes workflows in `.github/workflows/`:

1.  **CI** (`ci.yml`): Runs `pnpm check` and `pnpm build` on pull requests.
2.  **Deploy** (`deploy.yml`): Deploys to Cloudflare Workers on push to the `publish` branch.

### Manual Deployment

You can also deploy manually using Wrangler:

```bash
# Preview build locally
pnpm preview

# Deploy to Cloudflare Workers
pnpm build
npx wrangler deploy
```

## Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the project for production (`dist/`) |
| `pnpm preview` | Preview the production build locally |
| `pnpm check` | Run type-checking, linting, and formatting checks |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm format` | Format code with Prettier |
