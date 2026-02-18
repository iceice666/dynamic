import React, { useEffect, useState } from 'react';

export type TocHeading = { depth: number; slug: string; text: string };

interface BottomNavTOCProps {
  toc: TocHeading[];
  onNavigate: () => void;
}

export default function BottomNavTOC({ toc, onNavigate }: BottomNavTOCProps) {
  const filtered = toc.filter((h) => h.depth === 2 || h.depth === 3);
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const headings = toc.filter((h) => h.depth === 2 || h.depth === 3);
    if (headings.length === 0) return;

    const slugs = headings.map((h) => h.slug);
    const visibleHeadings = new Set<string>();

    function computeActive(): Set<string> {
      if (visibleHeadings.size > 0) {
        return new Set(visibleHeadings);
      }
      // Fallback: last heading above viewport top
      const viewportTop = window.scrollY;
      let lastAbove: string | null = null;
      for (const slug of slugs) {
        const el = document.getElementById(slug);
        if (el && el.offsetTop <= viewportTop + 10) {
          lastAbove = slug;
        }
      }
      return lastAbove ? new Set([lastAbove]) : new Set();
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
        setActiveSlugs(computeActive());
      },
      { rootMargin: '0px', threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    }

    // Initial state
    setActiveSlugs(computeActive());

    return () => observer.disconnect();
  }, [toc]);

  if (filtered.length === 0) return null;

  return (
    <div>
      <div
        style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-muted)',
          marginBottom: '0.5rem',
        }}
      >
        Table of Contents
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '40vh',
          overflowY: 'auto',
        }}
      >
        {filtered.map((h) => (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            onClick={onNavigate}
            style={{
              fontSize: h.depth === 3 ? '0.8125rem' : '0.875rem',
              color: activeSlugs.has(h.slug) ? 'var(--color-accent)' : 'var(--color-muted)',
              fontWeight: activeSlugs.has(h.slug) ? 500 : undefined,
              textDecoration: 'none',
              padding: '0.5rem 0.75rem',
              paddingLeft: h.depth === 3 ? '1.5rem' : '0.75rem',
              borderRadius: '0.25rem',
              lineHeight: 1.4,
              transition: 'color 0.15s ease, background 0.15s ease',
              background: activeSlugs.has(h.slug)
                ? 'oklch(from var(--color-accent) l c h / 0.1)'
                : 'transparent',
            }}
          >
            {h.text}
          </a>
        ))}
      </div>
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-border)',
          margin: '0.75rem 0 0',
        }}
      />
    </div>
  );
}
