import { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $mysteryUnlocked } from '$/stores/mystery';
import withStrictMode from '$/components/withStrictMode';

interface MysteryButtonProps {
  className?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}

function MysteryButton({ className, compact = false, align = 'left' }: MysteryButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unlocked = useStore($mysteryUnlocked);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleOutside(event: PointerEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open]);

  if (!mounted || !unlocked) return null;

  return (
    <div ref={menuRef} style={{ position: 'relative' }} className={className}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          gap: '0.5rem',
          borderRadius: '0.375rem',
          border: 'none',
          background: 'transparent',
          padding: '0.5rem',
          fontSize: '1.25rem', // Slightly larger for emoji
          lineHeight: '1',
          color: 'var(--color-muted)',
          cursor: 'pointer',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        aria-label="Mystery Button"
      >
        🤔
      </button>

      {open && (
        <>
          {/* Backdrop (transparent) */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          {/* Popover */}
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: align === 'left' ? 0 : 'auto',
              right: align === 'right' ? 0 : 'auto',
              zIndex: 50,
              width: 'max-content',
              maxWidth: '15rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-background)',
              padding: '0.75rem',
              boxShadow: '0 4px 16px oklch(0% 0 0 / 12%)',
              marginBottom: '0.25rem',
              fontSize: '0.875rem',
              color: 'var(--color-foreground)',
            }}
          >
            something strange appeared
          </div>
        </>
      )}
    </div>
  );
}

export default withStrictMode(MysteryButton);
