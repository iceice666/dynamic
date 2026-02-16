import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';

/**
 * Remark plugin to transform directive syntax (:::note, :::tip, etc.) into admonition HTML
 * Works with remark-directive to create styled callout boxes
 */
export const remarkAdmonitions: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const directive = node as ContainerDirective;
        const name = directive.name;

        // Only process recognized admonition types
        if (!['note', 'tip', 'warning', 'danger'].includes(name)) {
          return;
        }

        // Transform to HTML structure
        data.hName = 'div';
        data.hProperties = {
          class: `admonition admonition-${name}`,
          role: 'note',
          'aria-label': `${name} callout`,
        };
      }
    });
  };
};
