type TocHeading = { depth: number; slug: string; text: string };

interface BottomNavTOCProps {
  toc: TocHeading[];
  onNavigate: () => void;
}

export default function BottomNavTOC({ toc, onNavigate }: BottomNavTOCProps) {
  const filtered = toc.filter((h) => h.depth === 2 || h.depth === 3);
  if (filtered.length === 0) return null;

  return (
    <div style={{ marginBottom: '0.75rem' }}>
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
          gap: '0.25rem',
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
              fontSize: '0.8125rem',
              color: 'var(--color-muted)',
              textDecoration: 'none',
              padding: '0.1875rem 0.5rem',
              paddingLeft: h.depth === 3 ? '1.25rem' : '0.5rem',
              borderRadius: '0.25rem',
              lineHeight: 1.4,
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
