import type { Plugin, Transformer } from 'unified';
import type { Root, Text, PhrasingContent } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that transforms `|| spoiler text ||` into
 * `<span class="spoiler" role="button" tabindex="0">spoiler text</span>`
 *
 * The double-pipe syntax mirrors Discord's spoiler format.
 */
export const remarkSpoiler: Plugin<[], Root> = () => {
    const SPOILER_RE = /\|\|(.+?)\|\|/g;

    const transformer: Transformer<Root> = (tree) => {
        visit(tree, 'text', (node: Text, index, parent) => {
            if (!parent || index === undefined) return;

            const value = node.value;
            if (!SPOILER_RE.test(value)) return;

            // Reset regex lastIndex after test()
            SPOILER_RE.lastIndex = 0;

            const children: PhrasingContent[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = SPOILER_RE.exec(value)) !== null) {
                // Push text before the match
                if (match.index > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, match.index),
                    });
                }

                // Push the spoiler span as inline HTML via hast data
                children.push({
                    type: 'text',
                    value: match[1],
                    data: {
                        hName: 'span',
                        hProperties: {
                            class: 'spoiler',
                            role: 'button',
                            tabIndex: 0,
                        },
                        hChildren: [{ type: 'text', value: match[1] }],
                    },
                } as PhrasingContent);

                lastIndex = match.index + match[0].length;
            }

            // Push remaining text after the last match
            if (lastIndex < value.length) {
                children.push({
                    type: 'text',
                    value: value.slice(lastIndex),
                });
            }

            // Replace this node with the new children
            parent.children.splice(index, 1, ...children);
        });
    };

    return transformer;
};
