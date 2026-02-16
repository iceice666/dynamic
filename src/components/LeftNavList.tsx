import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Archive, Home, Search, Users, type LucideIcon } from 'lucide-react';
import { ui, type UIKey } from '../i18n/ui';

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

interface LeftNavListProps {
  currentPath: string;
}

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

export default function LeftNavList({ currentPath }: LeftNavListProps) {
  const [activeHref, setActiveHref] = useState(() => findActiveHref(currentPath));
  const pendingHrefRef = useRef<string | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorTransition =
    'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease';

  // Direct DOM mutation — no state, no extra re-render
  const updateIndicatorPosition = useCallback(
    (overrideHref?: string) => {
      const href = overrideHref ?? activeHref;
      const list = listRef.current;
      const indicator = indicatorRef.current;
      const activeEl = linkRefs.current[href];

      if (!list || !indicator) return;

      if (!activeEl) {
        indicator.style.opacity = '0';
        return;
      }

      const listRect = list.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      const height = Math.max(16, activeRect.height * 0.72);
      const x = activeRect.left - listRect.left - 2;
      const y = activeRect.top - listRect.top + (activeRect.height - height) / 2;

      indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      indicator.style.width = '6px';
      indicator.style.height = `${height}px`;
      indicator.style.opacity = '1';
    },
    [activeHref]
  );

  // Update indicator whenever activeHref changes
  useLayoutEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  // Listen for Astro navigation events
  useEffect(() => {
    // Early: start sliding as soon as navigation is detected (before view transition)
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
        requestAnimationFrame(() => updateIndicatorPosition(nextHref));
      }
    };

    // Fallback: correct any mismatch after navigation completes (back/forward, etc.)
    const handlePageLoad = () => {
      const nextHref = findActiveHref(window.location.pathname);
      setActiveHref(nextHref);
      requestAnimationFrame(() => updateIndicatorPosition(nextHref));
    };

    document.addEventListener('astro:before-preparation', handleBeforePreparation);
    document.addEventListener('astro:after-swap', handleAfterSwap);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:before-preparation', handleBeforePreparation);
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, [updateIndicatorPosition]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => updateIndicatorPosition());
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (listRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => updateIndicatorPosition());
      });
      resizeObserver.observe(listRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [updateIndicatorPosition]);

  return (
    <div className="relative m-0 flex list-none flex-col gap-1 p-0">
      <div
        ref={indicatorRef}
        aria-hidden="true"
        data-nav-indicator
        style={{
          position: 'absolute',
          borderRadius: '999px',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
          opacity: 0,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform, width, height, opacity',
          width: '0px',
          height: '0px',
          transition: indicatorTransition,
        }}
      />
      <ul ref={listRef} className="left-nav-list m-0 flex list-none flex-col gap-1 p-0">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <li key={item.href}>
              <a
                ref={(el) => {
                  linkRefs.current[item.href] = el;
                }}
                href={item.href}
                data-nav-href={item.href}
                className={`text-muted relative z-1 flex items-center gap-2.5 rounded-md p-2 text-[0.9rem] no-underline transition-colors duration-150 hover:text-foreground${
                  isActive ? 'text-foreground font-semibold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                <span className="left-nav-label" data-i18n-en>
                  {ui.en[item.labelKey]}
                </span>
                <span className="left-nav-label" data-i18n-zh-tw>
                  {ui['zh-tw'][item.labelKey]}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
