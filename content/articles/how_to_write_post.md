---
title: Writing Posts
description: how to spamming your ideas
category: meta
categoryName: Meta
tags: [meta, guide]
publishedAt: 2026-02-19
draft: false
lang: en
---

# Writing Posts

Posts are the short-form side of this blog — quick notes, observations, or things worth jotting down without the ceremony of a full article. The format is intentionally minimal: you can drop a markdown file in `content/posts/` with nothing but prose and it will just work.

## Minimal Format

At its simplest, a post is a markdown file with no frontmatter at all:

```markdown
Just shipped a small quality-of-life fix for the TOC observer.
Turns out `IntersectionObserver` thresholds need careful tuning on mobile.
```

That's it. No dates, no tags, no configuration required.

## Optional Frontmatter

If you want explicit control, both `publishedAt` and `tags` are recognized:

```markdown
---
publishedAt: 2026-02-16
tags: [astro, react]
---

Your post content here.
```

Both fields are optional and independently omittable — you can specify one without the other.

## Auto-Extracted Metadata

### Date from Git

When `publishedAt` is absent, the build reads the file's first commit date from git:

```
git log --diff-filter=A --follow --format=%aI -- <filepath>
```

This means the date reflects when the post was actually created, with no manual bookkeeping. If the file has no commits yet (e.g. during local development), today's date is used as a fallback.

### Tags from the Last Line

When `tags` is absent, the build inspects the last non-empty line of the post body. If it matches the pattern `#word #word ...`, those words become the tags and the line is stripped from the rendered output.

For example, this post:

```markdown
Just deployed my new blog using Astro 5.

#astro #blog
```

renders as a single paragraph — the `#astro #blog` line disappears — and the post surfaces under both the `astro` and `blog` tags in search.

## Limitations

Posts don't support `draft` or `lang` fields, and there's no translation system for them (the `{slug}.{lang}.md` convention only applies to articles).
