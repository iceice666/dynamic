---
title: Article Frontmatter Reference
description: Every frontmatter field the article schema supports, with types and explanations.
category: docs
categoryName: Docs
tags: [reference, frontmatter]
publishedAt: 2026-02-20
draft: false
lang: en
---

# Article Frontmatter Reference

All fields an article in `content/articles/` can declare. Only `publishedAt` is required; everything else is optional.

## Full Example

```yaml
---
title: My Article Title
description: A one-sentence summary for cards and SEO meta tags.
category: engineering
categoryName: Engineering
tags: [astro, typescript, tutorial]
publishedAt: 2026-01-15
draft: false
lang: en
---
```

## Field Reference

### `title` — `string` (optional)

The article title, shown in the page `<title>`, article header, and listing cards. If omitted, the content pipeline auto-extracts the first `# Heading 1` from the body.

```yaml
title: My Article Title
```

### `description` — `string` (optional)

A short summary used in cards, the `<meta name="description">` tag, and RSS. If omitted, auto-extracted from the first non-heading paragraph in the body.

```yaml
description: A brief summary of what this article covers.
```

### `category` — `string` (optional)

A URL-safe slug used to group articles and generate category pages. Lowercase, hyphens OK.

```yaml
category: web-performance
```

### `categoryName` — `string` (optional)

The human-readable display name for the category, shown in the UI. Should correspond to `category`.

```yaml
categoryName: Web Performance
```

### `tags` — `string[]` (default: `[]`)

A list of tags for filtering and search. Use lowercase, hyphens for spaces.

```yaml
tags: [astro, typescript, react]
```

### `publishedAt` — `date` (**required**)

The publication date, formatted as `YYYY-MM-DD`. Used for sorting and display.

```yaml
publishedAt: 2026-01-15
```

### `draft` — `boolean` (default: `false`)

When `true`, the article is excluded from listing pages, search index, and RSS. The page still builds — navigate directly to its URL to preview. Useful for work-in-progress articles.

```yaml
draft: true
```

### `lang` — `string` (optional)

The locale of the article. Set on the base file to declare its language. **Omit entirely** on translated files — their language is inferred from the filename suffix (e.g., `my-post.zh-tw.md` → `zh-tw`).

```yaml
lang: en      # English base file
lang: zh-tw   # Traditional Chinese base file (if the "base" is not English)
```

## Auto-Extracted Fields

Two fields are automatically computed by the build pipeline and do **not** go in frontmatter:

| Field | Source |
| --- | --- |
| `wordCount` | Counted from body text (CJK + Latin) |
| `readingTime` | Derived from word count |

These are available in Astro page templates via `entry.data.wordCount` and `entry.data.readingTime` after rendering.
