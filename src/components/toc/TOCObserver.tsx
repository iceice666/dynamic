import { useEffect } from 'react';

interface Props {
  headingSlugs: string[];
}

function TOCObserver({ headingSlugs }: Props) {
  useEffect(() => {
    if (headingSlugs.length === 0) return;

    const visibleHeadings = new Set<string>();

    function applyActive() {
      let activeSlugs: Set<string>;

      if (visibleHeadings.size > 0) {
        activeSlugs = new Set(visibleHeadings);
      } else {
        // Fallback: find last heading above viewport top
        const viewportTop = window.scrollY;
        let lastAbove: string | null = null;
        for (const slug of headingSlugs) {
          const el = document.getElementById(slug);
          if (el && el.offsetTop <= viewportTop + 10) {
            lastAbove = slug;
          }
        }
        activeSlugs = lastAbove ? new Set([lastAbove]) : new Set();
      }

      // Update all TOC panels simultaneously
      const allItems = document.querySelectorAll<HTMLElement>('[data-toc-panel] li[data-toc-id]');
      for (const li of allItems) {
        const id = li.getAttribute('data-toc-id');
        if (id && activeSlugs.has(id)) {
          li.classList.add('active');
        } else {
          li.classList.remove('active');
        }
      }

      // Scroll active item into view — only in visible panels
      const panels = document.querySelectorAll<HTMLElement>('[data-toc-panel]');
      for (const panel of panels) {
        if (!panel.offsetParent) continue; // skip hidden panels
        const firstActive = panel.querySelector<HTMLElement>('li.active');
        if (firstActive) {
          firstActive.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleHeadings.add(entry.target.id);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        }
        applyActive();
      },
      { rootMargin: '0px', threshold: 0 }
    );

    for (const slug of headingSlugs) {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    }

    // Apply on mount for initial/deep-linked state
    applyActive();

    return () => observer.disconnect();
  }, [headingSlugs]);

  return null;
}

import withStrictMode from '$/components/withStrictMode';
export default withStrictMode(TOCObserver);
