import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import withStrictMode from '$/components/withStrictMode';
import { Archive, Home, Menu, Search, Users, X, type LucideIcon } from 'lucide-react';
import { type UIKey } from '$/i18n/ui';
import { useTranslation } from '$/i18n';
import ThemeButton from '$/components/controls/ThemeButton';
import LanguageToggle from '$/components/controls/LanguageToggle';
import BottomNavTOC, { type TocHeading } from '$/components/toc/BottomNavTOC';

type NavItem = {
  labelKey: UIKey;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav_feed', href: '/', icon: Home },
  { labelKey: 'nav_friends', href: '/friends', icon: Users },
  { labelKey: 'nav_archive', href: '/archive', icon: Archive },
  { labelKey: 'nav_search', href: '/search', icon: Search },
];

function normalizePath(path: string): string {
  if (!path) return '/';
  const normalized = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return normalized || '/';
}

function isActivePath(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === '/') return path === '/';
  return path === target || path.startsWith(`${target}/`);
}

function findActiveHref(pathname: string): string {
  const found = NAV_ITEMS.find((item) => isActivePath(pathname, item.href));
  return found?.href ?? NAV_ITEMS[0]?.href ?? '/';
}

// type TocHeading imported from BottomNavTOC

interface BottomNavListProps {
  currentPath: string;
  toc?: TocHeading[];
}

function updateIndicatorPosition({
  activeHref,
  overrideHref,
  barEl,
  indicatorEl,
  linkRefs,
}: {
  activeHref: string;
  overrideHref?: string;
  barEl: HTMLDivElement | null;
  indicatorEl: HTMLDivElement | null;
  linkRefs: Record<string, HTMLAnchorElement | null>;
}): void {
  const href = overrideHref ?? activeHref;
  if (!barEl || !indicatorEl) return;

  const activeEl = linkRefs[href];
  if (!activeEl) {
    indicatorEl.style.opacity = '0';
    return;
  }

  const barRect = barEl.getBoundingClientRect();
  const activeRect = activeEl.getBoundingClientRect();

  const width = Math.max(18, activeRect.width * 0.56);
  const x = activeRect.left - barRect.left + (activeRect.width - width) / 2;

  indicatorEl.style.transform = `translate3d(${x}px, 0, 0)`;
  indicatorEl.style.width = `${width}px`;
  indicatorEl.style.opacity = '1';
}

function BottomNavList({ currentPath, toc }: BottomNavListProps) {
  const { t } = useTranslation();
  const [activeHref, setActiveHref] = useState(() => findActiveHref(currentPath));
  const [panelOpen, setPanelOpen] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const indicatorTransition =
    'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease';

  useLayoutEffect(() => {
    updateIndicatorPosition({
      activeHref,
      barEl: barRef.current,
      indicatorEl: indicatorRef.current,
      linkRefs: linkRefs.current,
    });
  }, [activeHref]);

  // Astro View Transitions
  useEffect(() => {
    const handleBeforePreparation = (event: Event) => {
      const to = (event as CustomEvent & { to?: URL }).to;
      if (to) {
        pendingHrefRef.current = findActiveHref(to.pathname);
      }
    };

    const handleAfterSwap = () => {
      if (pendingHrefRef.current) {
        const nextHref = pendingHrefRef.current;
        pendingHrefRef.current = null;
        setActiveHref(nextHref);
        requestAnimationFrame(() =>
          updateIndicatorPosition({
            activeHref,
            overrideHref: nextHref,
            barEl: barRef.current,
            indicatorEl: indicatorRef.current,
            linkRefs: linkRefs.current,
          })
        );
      }
    };

    const handlePageLoad = () => {
      const nextHref = findActiveHref(window.location.pathname);
      setActiveHref(nextHref);
      requestAnimationFrame(() =>
        updateIndicatorPosition({
          activeHref,
          overrideHref: nextHref,
          barEl: barRef.current,
          indicatorEl: indicatorRef.current,
          linkRefs: linkRefs.current,
        })
      );
    };

    document.addEventListener('astro:before-preparation', handleBeforePreparation);
    document.addEventListener('astro:after-swap', handleAfterSwap);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:before-preparation', handleBeforePreparation);
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, [activeHref]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() =>
        updateIndicatorPosition({
          activeHref,
          barEl: barRef.current,
          indicatorEl: indicatorRef.current,
          linkRefs: linkRefs.current,
        })
      );
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (barRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() =>
          updateIndicatorPosition({
            activeHref,
            barEl: barRef.current,
            indicatorEl: indicatorRef.current,
            linkRefs: linkRefs.current,
          })
        );
      });
      resizeObserver.observe(barRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [activeHref]);

  // Close panel on navigation
  useEffect(() => {
    setPanelOpen(false);
  }, [activeHref]);

  return (
    <>
      {/* Slide-up panel backdrop */}
      {panelOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'oklch(0% 0 0 / 40%)',
            zIndex: 9,
            transition: 'opacity 0.2s ease',
          }}
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Slide-up panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 56,
          left: 0,
          right: 0,
          zIndex: 11,
          background: 'var(--color-background)',
          borderTop: '1px solid var(--color-border)',
          borderRadius: '1rem 1rem 0 0',
          padding: '1rem 1.25rem',
          transform: panelOpen ? 'translateY(0)' : 'translateY(100%)',
          visibility: panelOpen ? 'visible' : 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0.3s',
          pointerEvents: panelOpen ? 'auto' : 'none',
          boxShadow: panelOpen ? '0 -4px 20px oklch(0% 0 0 / 10%)' : 'none',
        }}
      >
        {toc && <BottomNavTOC toc={toc} onNavigate={() => setPanelOpen(false)} />}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
          <ThemeButton className="flex-1" compact align="left" />
          <LanguageToggle className="flex-1" compact align="right" />
        </div>
      </div>

      {/* Bottom nav bar */}
      <div
        ref={barRef}
        style={{
          position: 'relative',
          zIndex: 12,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          background: 'var(--color-background)',
        }}
      >
        {/* Indicator */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            borderRadius: '999px',
            background: 'var(--color-accent)',
            pointerEvents: 'none',
            opacity: 0,
            width: '0px',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, width, opacity',
            transition: indicatorTransition,
          }}
        />

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <a
              key={item.href}
              ref={(el) => {
                linkRefs.current[item.href] = el;
              }}
              href={item.href}
              data-nav-href={item.href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                color: isActive ? 'var(--color-foreground)' : 'var(--color-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="sr-only">{t(item.labelKey)}</span>
            </a>
          );
        })}

        {/* Others button */}
        <button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          aria-label="More options"
          aria-expanded={panelOpen}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: panelOpen ? 'var(--color-foreground)' : 'var(--color-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.15s ease',
          }}
        >
          {panelOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}

export default withStrictMode(BottomNavList);
