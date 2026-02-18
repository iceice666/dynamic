import Giscus from '@giscus/react';
import { useSyncExternalStore } from 'react';
import { useLocale } from '$/i18n/useLocale';
import { giscus } from '../../dynamic.config';

function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function GiscusWidget() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'light' as const);
  const locale = useLocale();
  const lang = locale === 'zh-tw' ? 'zh-TW' : 'en';

  return (
    <div className="border-border mt-12 border-t pt-8">
      <Giscus
        id="giscus-comments"
        repo={giscus.repo}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang={lang}
        loading="lazy"
      />
    </div>
  );
}

export default function GiscusComments() {
  if (!giscus.repo) return null;
  return <GiscusWidget />;
}
