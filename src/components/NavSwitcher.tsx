import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Folder, Rss, Tag, Users } from 'lucide-react';

export interface NavSwitcherItem {
  labelEn: string;
  labelZh: string;
  href: string;
  icon: 'rss' | 'folder' | 'tag' | 'users' | 'archive';
}

interface NavSwitcherProps {
  items: NavSwitcherItem[];
  currentPath: string;
}

interface IndicatorStyles {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

const navIcons = {
  rss: Rss,
  folder: Folder,
  tag: Tag,
  users: Users,
  archive: Archive,
} as const;

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

function findActiveIndex(pathname: string, items: NavSwitcherItem[]): number {
  const index = items.findIndex((item) => isActivePath(pathname, item.href));
  return index >= 0 ? index : 0;
}

function NavSwitcher({ items, currentPath }: NavSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(() => findActiveIndex(currentPath, items));
  const [indicator, setIndicator] = useState<IndicatorStyles>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const labels = useMemo(
    () =>
      items.map((item) => ({
        en: item.labelEn,
        zh: item.labelZh,
      })),
    [items]
  );

  const updateIndicator = () => {
    const list = listRef.current;
    const activeEl = buttonRefs.current[activeIndex];

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
  };

  useEffect(() => {
    const handlePageLoad = () => {
      const nextIndex = findActiveIndex(window.location.pathname, items);
      setActiveIndex(nextIndex);
    };

    handlePageLoad();
    document.addEventListener('astro:page-load', handlePageLoad);
    return () => document.removeEventListener('astro:page-load', handlePageLoad);
  }, [items]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateIndicator);
    const handleResize = () => window.requestAnimationFrame(updateIndicator);

    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex, items]);

  const performSelectionSideEffect = (item: NavSwitcherItem, index: number) => {
    document.documentElement.dataset.activeNav = item.href;
    window.dispatchEvent(
      new CustomEvent('dynamic:nav-switch', {
        detail: {
          href: item.href,
          index,
        },
      })
    );
  };

  const handleSelect = (item: NavSwitcherItem, index: number) => {
    setActiveIndex(index);
    performSelectionSideEffect(item, index);
  };

  return (
    <div
      ref={listRef}
      className="relative m-0 flex list-none flex-col gap-1 p-0 max-sm:flex-row max-sm:justify-around max-sm:gap-1"
    >
      <div
        aria-hidden="true"
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

      {items.map((item, index) => {
        const Icon = navIcons[item.icon];
        const isActive = activeIndex === index;
        const isCurrentPath = isActivePath(currentPath, item.href);

        return (
          <a
            key={item.href}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            href={item.href}
            onClick={() => handleSelect(item, index)}
            className={`text-muted relative z-[1] flex items-center gap-2.5 rounded-md p-2 text-[0.9rem] font-normal no-underline transition-colors duration-150 hover:text-[var(--color-foreground)] max-sm:justify-center max-sm:px-2.5 max-sm:py-1.5${isActive ? 'font-semibold text-[var(--color-foreground)]' : ''}`}
            aria-current={isCurrentPath ? 'page' : undefined}
            data-nav-href={item.href}
          >
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span className="left-nav-label max-sm:hidden" data-i18n-en>
              {labels[index].en}
            </span>
            <span className="left-nav-label max-sm:hidden" data-i18n-zh-tw>
              {labels[index].zh}
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default memo(NavSwitcher);
