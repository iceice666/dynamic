import { toString } from 'mdast-util-to-string';
import type { Plugin, Transformer } from 'unified';
import type { Root, Heading, Paragraph } from 'mdast';

/**
 * Remark plugin that extracts title/description from markdown body when
 * frontmatter is missing them, or deduplicates when they match.
 *
 * - If frontmatter title is missing OR matches the first h1 → remove h1 from AST
 * - If frontmatter description is missing OR matches the first paragraph → remove it from AST
 * - Stores extracted values in frontmatter as extractedTitle / extractedDescription
 */
export const remarkContentExtractor: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    const filePath = file.history[0];
    if (filePath?.includes('/content/posts/')) return;

    const frontmatter = file.data.astro?.frontmatter;
    if (!frontmatter) return;

    // Find first top-level h1
    const h1Index = tree.children.findIndex(
      (node): node is Heading => node.type === 'heading' && node.depth === 1
    );
    const h1 = h1Index !== -1 ? (tree.children[h1Index] as Heading) : null;
    const h1Text = h1 ? toString(h1).trim() : null;

    // Find first top-level paragraph (after h1 if present, otherwise first one)
    const searchStart = h1Index !== -1 ? h1Index + 1 : 0;
    const pIndex = tree.children.findIndex(
      (node, i): node is Paragraph => i >= searchStart && node.type === 'paragraph'
    );
    const p = pIndex !== -1 ? (tree.children[pIndex] as Paragraph) : null;
    const pText = p ? toString(p).trim() : null;

    // Title: extract from h1 if frontmatter title is missing or matches
    if (h1Text && (!frontmatter.title || frontmatter.title === h1Text)) {
      frontmatter.extractedTitle = h1Text;
      tree.children.splice(h1Index, 1);
    }

    // Description: extract from first paragraph if frontmatter description is missing or matches
    // Re-find paragraph index since h1 removal may have shifted indices
    if (pText && (!frontmatter.description || frontmatter.description === pText)) {
      const currentPIndex = tree.children.indexOf(p!);
      if (currentPIndex !== -1) {
        frontmatter.extractedDescription = pText;
        tree.children.splice(currentPIndex, 1);
      }
    }
  };

  return transformer;
};
