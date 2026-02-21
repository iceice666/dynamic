import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import withStrictMode from '$/components/withStrictMode';
import { Archive, Home, Search, UserRound, Users, type LucideIcon } from 'lucide-react';
import { type UIKey } from '$/i18n/ui';
import { useTranslation, getLocaleLink } from '$/i18n';

type NavItem = {
  labelKey: UIKey;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav_feed', href: '/', icon: Home },
  { labelKey: 'nav_about', href: '/articles/about-me', icon: UserRound },
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
  if (target.endsWith('/')) {
    return path === target || path.startsWith(target);
  }
  return path === target || path.startsWith(`${target}/`);
}

function findActiveHref(pathname: string, items: NavItem[]): string {
  const found = items.find((item) => isActivePath(pathname, item.href));
  return found?.href ?? items[0]?.href ?? '/';
}

function updateIndicatorPosition({
  activeHref,
  overrideHref,
  listEl,
  indicatorEl,
  linkRefs,
}: {
  activeHref: string;
  overrideHref?: string;
  listEl: HTMLUListElement | null;
  indicatorEl: HTMLDivElement | null;
  linkRefs: Record<string, HTMLAnchorElement | null>;
}): void {
  const href = overrideHref ?? activeHref;
  if (!listEl || !indicatorEl) return;

  const activeEl = linkRefs[href];
  if (!activeEl) {
    indicatorEl.style.opacity = '0';
    return;
  }

  const listRect = listEl.getBoundingClientRect();
  const activeRect = activeEl.getBoundingClientRect();

  const height = Math.max(16, activeRect.height * 0.72);
  const x = activeRect.left - listRect.left - 7;
  const y = activeRect.top - listRect.top + (activeRect.height - height) / 2;

  indicatorEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  indicatorEl.style.width = '6px';
  indicatorEl.style.height = `${height}px`;
  indicatorEl.style.opacity = '1';
}

function LeftNavList({ currentPath }: LeftNavListProps) {
  const { t, locale } = useTranslation();

  const localizedItems = React.useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        href: getLocaleLink(item.href, locale),
      })),
    [locale]
  );

  const [activeHref, setActiveHref] = useState(() => findActiveHref(currentPath, localizedItems));
  const pendingHrefRef = useRef<string | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const localizedItemsRef = useRef(localizedItems);
  localizedItemsRef.current = localizedItems;
  const indicatorTransition =
    'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease';

  // Update indicator whenever activeHref changes
  useLayoutEffect(() => {
    updateIndicatorPosition({
      activeHref,
      listEl: listRef.current,
      indicatorEl: indicatorRef.current,
      linkRefs: linkRefs.current,
    });
  }, [activeHref]);

  // Keep a ref to the latest activeHref so event handlers always read current value
  const activeHrefRef = useRef(activeHref);
  activeHrefRef.current = activeHref;

  // Listen for Astro navigation events
  useEffect(() => {
    // Early: start sliding as soon as navigation is detected (before view transition)
    const handleBeforePreparation = (event: Event) => {
      const to = (event as CustomEvent & { to?: URL }).to;
      if (to) {
        pendingHrefRef.current = findActiveHref(to.pathname, localizedItemsRef.current);
      }
    };

    const handleAfterSwap = () => {
      if (pendingHrefRef.current) {
        const nextHref = pendingHrefRef.current;
        pendingHrefRef.current = null;
        setActiveHref(nextHref);
        requestAnimationFrame(() =>
          updateIndicatorPosition({
            activeHref: activeHrefRef.current,
            overrideHref: nextHref,
            listEl: listRef.current,
            indicatorEl: indicatorRef.current,
            linkRefs: linkRefs.current,
          })
        );
      }
    };

    // Fallback: correct any mismatch after navigation completes (back/forward, etc.)
    const handlePageLoad = () => {
      const nextHref = findActiveHref(window.location.pathname, localizedItemsRef.current);
      setActiveHref(nextHref);
      requestAnimationFrame(() =>
        updateIndicatorPosition({
          activeHref: activeHrefRef.current,
          overrideHref: nextHref,
          listEl: listRef.current,
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
  }, []);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() =>
        updateIndicatorPosition({
          activeHref,
          listEl: listRef.current,
          indicatorEl: indicatorRef.current,
          linkRefs: linkRefs.current,
        })
      );
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (listRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() =>
          updateIndicatorPosition({
            activeHref,
            listEl: listRef.current,
            indicatorEl: indicatorRef.current,
            linkRefs: linkRefs.current,
          })
        );
      });
      resizeObserver.observe(listRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [activeHref]);

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
          transform: 'translate(-7px, 0)',
          willChange: 'transform, width, height, opacity',
          width: '0px',
          height: '0px',
          transition: indicatorTransition,
        }}
      />
      <ul ref={listRef} className="left-nav-list m-0 flex list-none flex-col gap-1 p-0">
        {localizedItems.map((item) => {
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
                className={`text-muted hover:text-foreground relative z-1 flex items-center gap-2.5 rounded-md p-2 text-[0.9rem] no-underline transition-colors duration-150 ${
                  isActive ? 'text-foreground font-semibold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                <span className="left-nav-label">{t(item.labelKey)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default withStrictMode(LeftNavList);
