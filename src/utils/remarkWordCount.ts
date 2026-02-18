import { visit } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { Root } from 'mdast';

const CJK_RE = /[\u3040-\u9fff\uac00-\ud7af]/g;
const LATIN_RE = /\b[a-zA-Z0-9'-]+\b/g;

/**
 * Remark plugin that counts words in the markdown AST and computes reading time.
 * Visits only `text` leaf nodes — naturally excludes `code`, `inlineCode`, `image`,
 * `html`, and link URLs (stored as `node.url`, not as child text nodes).
 * Stores `wordCount` and `readingTime` in `file.data.astro.frontmatter`.
 */
export const remarkWordCount: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    const frontmatter = file.data.astro?.frontmatter;
    if (!frontmatter) return;

    let cjk = 0;
    let latin = 0;

    visit(tree, 'text', (node) => {
      const value = node.value;
      cjk += (value.match(CJK_RE) || []).length;
      latin += (value.match(LATIN_RE) || []).length;
    });

    const wordCount = cjk + latin;
    frontmatter.wordCount = wordCount;
    frontmatter.readingTime = Math.max(1, Math.round(wordCount / 230));
  };

  return transformer;
};
