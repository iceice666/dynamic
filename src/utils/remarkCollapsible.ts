import type { Plugin } from 'unified';
import type { Root } from 'mdast';

type MdastNode = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const OPEN_PREFIX = ':::|> ';
const CLOSE_TEXT = ':::';

/**
 * Remark plugin to transform `:::|> Title` ... `:::` blocks into collapsible <details> elements.
 *
 * Syntax:
 *   :::|> Title text — supports **bold**, `code`, _italic_, etc.
 *
 *   Content paragraph one.
 *
 *   Content paragraph two.
 *
 *   :::
 *
 * Content inside the block supports full markdown (admonitions, code blocks, etc.).
 * Inline markdown in the title is also rendered correctly.
 */

function processChildren(children: MdastNode[]): void {
  let i = 0;
  while (i < children.length) {
    const child = children[i];

    // Recurse into block containers first (bottom-up, handles nesting)
    if (child.children && child.type !== 'paragraph') {
      processChildren(child.children);
    }

    if (child.type === 'paragraph') {
      const inlines: MdastNode[] = child.children ?? [];
      const first = inlines[0];

      if (
        first?.type === 'text' &&
        typeof first.value === 'string' &&
        first.value.startsWith(OPEN_PREFIX)
      ) {
        const summaryText = first.value.slice(OPEN_PREFIX.length);

        // Find the closing :::
        let closeIdx = -1;
        for (let j = i + 1; j < children.length; j++) {
          const candidate = children[j];
          if (
            candidate.type === 'paragraph' &&
            candidate.children?.length === 1 &&
            candidate.children[0].type === 'text' &&
            candidate.children[0].value === CLOSE_TEXT
          ) {
            closeIdx = j;
            break;
          }
        }

        if (closeIdx !== -1) {
          const contentNodes = children.slice(i + 1, closeIdx);

          const summaryNode: MdastNode = {
            type: 'paragraph',
            data: { hName: 'summary' },
            children: [{ ...first, value: summaryText }, ...inlines.slice(1)],
          };

          const contentWrapper: MdastNode = {
            type: 'blockquote',
            data: { hName: 'div', hProperties: { class: 'collapsible-content' } },
            children: contentNodes,
          };

          const detailsNode: MdastNode = {
            type: 'collapsible',
            data: { hName: 'details', hProperties: { class: 'collapsible' } },
            children: [summaryNode, contentWrapper],
          };

          children.splice(i, closeIdx - i + 1, detailsNode);
          // Don't increment — re-check this position for back-to-back collapsibles
          continue;
        }
      }
    }

    i++;
  }
}

export const remarkCollapsible: Plugin<[], Root> = () => {
  return (tree: Root) => {
    processChildren(tree.children as MdastNode[]);
  };
};
