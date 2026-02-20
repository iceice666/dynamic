---
title: This is a Draft
description: A draft article — not shown in listings or search, but still accessible by direct URL.
category: docs
tags: [draft, reference]
publishedAt: 2026-02-20
draft: true
lang: en
---

# This is a Draft

This article has `draft: true` in its frontmatter. That means:

- It does **not** appear in the articles listing page.
- It is **not** included in the search index.
- It is **not** in the RSS feed.
- It **does** build and is accessible by navigating directly to `/articles/draft-article`.

This is useful for articles you are still working on — you can share the URL with collaborators for review without publishing to the feed.

## How to Publish

Change `draft: true` to `draft: false` (or remove the line, since `false` is the default) and the article will appear everywhere.

```yaml
---
draft: false   # or just remove this line
---
```
