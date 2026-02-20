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

/**
 * Remark plugin to transform `|> Title` ... `---` blocks into collapsible <details> elements.
 *
 * Syntax:
 *   |> Title text here
 *
 *   Content paragraph one.
 *
 *   Content paragraph two.
 *
 *   ---
 *
 * The `---` (thematic break) must be preceded by a blank line to avoid being
 * parsed as a setext heading. Content inside the block supports full markdown.
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
        first.value.startsWith('|>')
      ) {
        const summaryText = first.value.slice(2).trimStart();

        // Find the closing thematic break (---)
        let closeIdx = -1;
        for (let j = i + 1; j < children.length; j++) {
          if (children[j].type === 'thematicBreak') {
            closeIdx = j;
            break;
          }
        }

        if (closeIdx !== -1) {
          const contentNodes = children.slice(i + 1, closeIdx);

          // Summary element: paragraph → <summary>
          const summaryNode: MdastNode = {
            type: 'paragraph',
            data: { hName: 'summary' },
            children: [{ ...first, value: summaryText }, ...inlines.slice(1)],
          };

          // Content wrapper: → <div class="collapsible-content">
          const contentWrapper: MdastNode = {
            type: 'blockquote',
            data: { hName: 'div', hProperties: { class: 'collapsible-content' } },
            children: contentNodes,
          };

          // Details wrapper: → <details class="collapsible">
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
