import { memo, useEffect } from 'react';

interface Props {
  headingSlugs: string[];
}

function TOCObserver({ headingSlugs }: Props) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Remove active from all
            document.querySelectorAll('#toc-list li').forEach((li) => {
              li.classList.remove('active');
            });
            // Add active to matching
            const li = document.querySelector(`#toc-list li[data-toc-id="${id}"]`);
            if (li) {
              li.classList.add('active');
              li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    for (const slug of headingSlugs) {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headingSlugs]);

  return null;
}

export default memo(TOCObserver);
