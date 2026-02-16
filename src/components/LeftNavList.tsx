import { useCallback, useEffect, useRef, useState } from 'react';
import { Archive, Folder, Home, Tag, Users, type LucideIcon } from 'lucide-react';
import { ui, type UIKey } from '../i18n/ui';

type NavItem = {
  labelKey: UIKey;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav_feed', href: '/', icon: Home },
  { labelKey: 'nav_categories', href: '/categories', icon: Folder },
  { labelKey: 'nav_tags', href: '/tags', icon: Tag },
  { labelKey: 'nav_friends', href: '/friends', icon: Users },
  { labelKey: 'nav_archive', href: '/archive', icon: Archive },
];

interface LeftNavListProps {
  currentPath: string;
}

interface IndicatorStyles {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
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
  const [indicator, setIndicator] = useState<IndicatorStyles>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const activeEl = linkRefs.current[activeHref];

    if (!list || !activeEl) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const listRect = list.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    if (isMobile) {
      const width = Math.max(18, activeRect.width * 0.56);
      const x = activeRect.left - listRect.left + (activeRect.width - width) / 2;
      const y = activeRect.bottom - listRect.top - 3;

      setIndicator({
        x,
        y,
        width,
        height: 3,
        opacity: 1,
      });
      return;
    }

    const height = Math.max(16, activeRect.height * 0.72);
    const x = activeRect.left - listRect.left - 2;
    const y = activeRect.top - listRect.top + (activeRect.height - height) / 2;

    setIndicator({
      x,
      y,
      width: 6,
      height,
      opacity: 1,
    });
  }, [activeHref]);

  useEffect(() => {
    const handlePageLoad = () => {
      setActiveHref(findActiveHref(window.location.pathname));
    };

    handlePageLoad();
    document.addEventListener('astro:page-load', handlePageLoad);
    return () => document.removeEventListener('astro:page-load', handlePageLoad);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateIndicator);
    const handleResize = () => window.requestAnimationFrame(updateIndicator);

    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateIndicator]);

  const handleSelect = (href: string) => {
    setActiveHref(href);
  };

  return (
    <div className="relative m-0 flex list-none flex-col gap-1 p-0 max-sm:flex-row max-sm:justify-around max-sm:gap-1">
      <div
        aria-hidden="true"
        data-nav-indicator
        style={{
          position: 'absolute',
          borderRadius: '999px',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
          opacity: indicator.opacity,
          transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
          width: `${indicator.width}px`,
          height: `${indicator.height}px`,
          transition:
            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
        }}
      />
      <ul
        ref={listRef}
        className="left-nav-list m-0 flex list-none flex-col gap-1 p-0 max-sm:flex-row max-sm:justify-around max-sm:gap-1"
      >
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
                onClick={() => handleSelect(item.href)}
                className={`text-muted relative z-1 flex items-center gap-2.5 rounded-md p-2 text-[0.9rem] no-underline transition-colors duration-150 hover:text-foreground${
                  isActive ? 'text-foreground font-semibold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                <span className="left-nav-label max-sm:hidden" data-i18n-en>
                  {ui.en[item.labelKey]}
                </span>
                <span className="left-nav-label max-sm:hidden" data-i18n-zh-tw>
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
