---
title: Getting Started
description: A quick tour of this blog's content system — articles, posts, translations, and frontmatter.
category: docs
categoryName: Docs
tags: [guide, meta]
publishedAt: 2026-02-20
draft: false
lang: en
---

# Getting Started

Welcome to the demo content for this Astro blog. Everything in `content/` is a live reference — each file demonstrates a real feature of the content system.

## Two Content Types

### Articles

Articles live in `content/articles/`. They are long-form, structured pieces with full frontmatter support:

```yaml
---
title: My Article
description: A short summary shown in cards and SEO.
category: engineering        # slug used in URLs
categoryName: Engineering    # display name shown in UI
tags: [astro, tutorial]
publishedAt: 2026-01-15
draft: false
lang: en                     # any locale; omit on translated files
---
```

All fields except `publishedAt` are optional — `title` and `description` can be auto-extracted from the markdown body if omitted (the first `# Heading` becomes the title, the first paragraph becomes the description).

### Posts

Posts live in `content/posts/`. They are short-form notes with minimal ceremony. The simplest valid post is a file with no frontmatter at all:

```markdown
Just noticed that Astro 5 makes content collections a lot faster.
Worth upgrading.
```

See the posts section for full details.

## Translations

Articles support translations via the `{slug}.{lang}.md` filename convention:

```
content/articles/
  getting-started.md          ← base (English)
  getting-started.zh-tw.md    ← translation (Traditional Chinese)
```

The base file must include a `lang` field declaring its language (e.g. `lang: en`, `lang: zh-tw`). The translated file omits `lang` entirely — its locale is inferred from the filename suffix. The site automatically links the two, showing a language switcher on the article page.

This article (`getting-started.md`) has a companion translation — switch to 中文 to see it.

## Draft Articles

Setting `draft: true` in frontmatter hides the article from listings and search. It still builds, so you can preview it by navigating directly to its URL. See `draft-article.md` in this collection for a live example.

## Explore the Reference Files

| File | Demonstrates |
| --- | --- |
| `getting-started.md` + `.zh-tw.md` | Translation pair, standard frontmatter |
| `markdown-showcase.md` + `.zh-tw.md` | Every markdown feature this blog supports |
| `article-frontmatter.md` | All article schema fields with explanations |
| `draft-article.md` | `draft: true` behavior |
