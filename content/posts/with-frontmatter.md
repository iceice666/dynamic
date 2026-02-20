---
publishedAt: 2026-02-20
tags: [demo, posts, frontmatter]
---

This post uses explicit frontmatter for both `publishedAt` and `tags`.

Both fields are optional and independently omittable — you can specify one without the other. Posts do not support `title`, `description`, `draft`, `lang`, or any of the article-specific fields.

The first `# Heading` in a post body is rendered as a heading — unlike articles, there is no auto-extraction of title/description for post cards. Post cards show a plain text preview of the body.

---

`remark-breaks` is active in posts, so a single newline becomes a `<br>`.
This line follows the one above with just one newline in source.
And this one too — no trailing spaces or blank lines needed.
