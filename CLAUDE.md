# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321 (hot reload)
pnpm build      # Build static site to ./dist/
pnpm preview    # Preview production build locally
pnpm astro add  # Add integrations (React, Tailwind, etc.)
pnpm astro check # Type-check .astro files
```

No linting or testing frameworks are configured.

## Architecture

> https://docs.astro.build/llms.txt for full docs

This is an **Astro 5** static site project.

- `src/pages/` — File-based routing. Each `.astro` file maps directly to a URL path.
- `src/layouts/` — HTML shell components wrapping page content via `<slot />`.
- `src/components/` — Reusable UI components.
- `src/assets/` — Images/SVGs processed and optimized at build time (import them in code).
- `public/` — Static files copied as-is to the output (favicons, robots.txt, etc.).

Astro components use a frontmatter script block (between `---` fences) for server-side logic, followed by the HTML template. CSS inside `<style>` tags is scoped to the component by default.

The current `astro.config.mjs` is empty — no integrations or SSR adapter are configured, so the project builds as fully static HTML.
