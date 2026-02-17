/**
 * Shiki transformer that wraps code blocks with a header containing
 * a language label and a copy button.
 */
export function codeBlockTransformer() {
  return {
    name: 'code-block-header',
    pre(
      this: { options: { lang?: string } },
      node: { tagName: string; properties: Record<string, unknown>; children: unknown[] }
    ) {
      const lang = this.options.lang || '';

      // Wrap: <div class="code-block-wrapper"> <div class="code-block-header">...</div> <pre>...</pre> </div>
      const header = {
        type: 'element' as const,
        tagName: 'div',
        properties: { class: 'code-block-header' },
        children: [
          {
            type: 'element' as const,
            tagName: 'span',
            properties: { class: 'code-block-lang' },
            children: [{ type: 'text' as const, value: lang }],
          },
          {
            type: 'element' as const,
            tagName: 'button',
            properties: {
              class: 'code-block-copy',
              type: 'button',
              'aria-label': 'Copy code',
            },
            children: [{ type: 'text' as const, value: 'Copy' }],
          },
        ],
      };

      // Clone the pre node
      const pre = { ...node };

      // Transform this node into the wrapper div
      node.tagName = 'div';
      node.properties = { class: 'code-block-wrapper', 'data-language': lang };
      node.children = [header, pre] as typeof node.children;
    },
  };
}
