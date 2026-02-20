import type { Plugin, Transformer } from 'unified';
import type { Root, Heading } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that auto-converts headers to paragraphs for posts in content/posts/.
 * Prevents '# title' from becoming '<h1>title</h1>'.
 */
export const remarkBanHeaders: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    const filePath = file.history[0];
    if (!filePath?.includes('/content/posts/')) return;

    visit(tree, 'heading', (node: Heading) => {
      // Modify the node in-place to become a paragraph, preserving its children
      const pNode = node as unknown as Record<string, unknown>;
      pNode.type = 'paragraph';
      delete pNode.depth;
    });
  };

  return transformer;
};
