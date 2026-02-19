import { execSync } from 'child_process';
import { toString } from 'mdast-util-to-string';
import type { Plugin, Transformer } from 'unified';
import type { Root, Paragraph } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that auto-extracts tags and publishedAt for posts in content/posts/.
 *
 * - Tags: if frontmatter.tags is absent, checks the last root-level paragraph.
 *   If it matches `#word #word ...`, extracts the tags and removes the line from the AST.
 * - publishedAt: if frontmatter.publishedAt is absent, reads the first commit date
 *   from `git log --diff-filter=A --follow --format=%aI -- <filepath>`.
 *   Falls back to current date if git fails or returns empty.
 */
export const remarkPostMeta: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    const filePath = file.history[0];
    if (!filePath?.includes('/content/posts/')) return;

    const frontmatter = file.data.astro?.frontmatter;
    if (!frontmatter) return;

    // Tags extraction: find last root-level paragraph
    if (!frontmatter.tags) {
      let lastParaIndex = -1;
      let lastPara: Paragraph | null = null;

      visit(tree, 'paragraph', (node: Paragraph) => {
        // Only consider top-level paragraphs (direct children of root)
        if (tree.children.includes(node)) {
          lastParaIndex = tree.children.indexOf(node);
          lastPara = node;
        }
      });

      if (lastPara !== null && lastParaIndex !== -1) {
        const text = toString(lastPara as Paragraph).trim();
        if (/^(#\w+\s*)+$/.test(text)) {
          frontmatter.tags = text.match(/#(\w+)/g)!.map((t) => t.slice(1));
          tree.children.splice(lastParaIndex, 1);
        }
      }
    }

    // Date extraction: read from git log if publishedAt is absent
    if (!frontmatter.publishedAt) {
      try {
        const dateStr = execSync(`git log --diff-filter=A --follow --format=%aI -- "${filePath}"`)
          .toString()
          .trim()
          .split('\n')[0];
        frontmatter.publishedAt = dateStr ? new Date(dateStr) : new Date();
      } catch {
        frontmatter.publishedAt = new Date();
      }
    }
  };

  return transformer;
};
