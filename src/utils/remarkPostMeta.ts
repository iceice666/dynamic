import { execFileSync } from 'child_process';
import { toString } from 'mdast-util-to-string';
import type { Plugin, Transformer } from 'unified';
import type { Root, Paragraph } from 'mdast';
import { visit } from 'unist-util-visit';
import path from 'node:path';

const CONTENT_ROOT = process.env.DYNAMIC_CONTENT_ROOT ?? 'content';
const CONTENT_GIT_ROOT = process.env.DYNAMIC_CONTENT_GIT_ROOT ?? process.cwd();
const CONTENT_GIT_DIR = process.env.DYNAMIC_CONTENT_GIT_DIR ?? 'content';

function isOutsideContentRoot(relativePath: string) {
  return (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}

function getPostContentPath(filePath: string): string | null {
  const contentRoot = path.resolve(CONTENT_ROOT);
  const absoluteFilePath = path.resolve(filePath);
  const relativePath = path.relative(contentRoot, absoluteFilePath);

  if (isOutsideContentRoot(relativePath)) return null;

  const [collection] = relativePath.split(path.sep);
  return collection === 'posts' ? relativePath : null;
}

function toGitPath(filePath: string) {
  return filePath.split(path.sep).join('/');
}

function getFirstCommitDate(relativeContentPath: string): Date | null {
  const gitRoot = path.resolve(CONTENT_GIT_ROOT);
  const gitPath = toGitPath(path.join(CONTENT_GIT_DIR, relativeContentPath));

  try {
    const dateStr = execFileSync(
      'git',
      [
        '-C',
        gitRoot,
        'log',
        '--diff-filter=A',
        '--follow',
        '--reverse',
        '--format=%aI',
        '--',
        gitPath,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    )
      .trim()
      .split('\n')
      .find(Boolean);

    if (!dateStr) return null;

    const date = new Date(dateStr);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Remark plugin that auto-extracts tags and publishedAt for posts in content/posts/.
 *
 * - Tags: if frontmatter.tags is absent, checks the last root-level paragraph.
 *   If it matches `#word #word ...`, extracts the tags and removes the line from the AST.
 * - publishedAt: if frontmatter.publishedAt is absent, reads the first commit date
 *   from the content git repo. Set `DYNAMIC_CONTENT_GIT_ROOT` when content is
 *   overlaid into the platform tree during CI/CD so the source repo history is
 *   still used.
 */
export const remarkPostMeta: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    const filePath = file.history[0];
    const postPath = filePath ? getPostContentPath(filePath) : null;
    if (!postPath) return;

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
      frontmatter.publishedAt = getFirstCommitDate(postPath) ?? new Date();
    }
  };

  return transformer;
};
