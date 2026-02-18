import React from 'react';
import { author } from '../../../dynamic.config';
import { useTranslation } from '$/i18n';
import { socialHref, socialIcon } from '$/utils/social';
import withStrictMode from '$/components/withStrictMode';

function AuthorBio() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-xs leading-[1.4]">{t('author_bio_heading')}</span>
      </div>
      <img
        className="border-border h-12 w-12 rounded-full border-2 object-cover"
        src={author.avatar}
        alt="Author avatar"
        width="48"
        height="48"
        loading="eager"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-sm font-semibold">{author.name}</span>
        <span className="text-muted text-xs leading-[1.4]">{author.tagline}</span>
      </div>
      <div className="mt-1 flex gap-2">
        {author.socials.map((link) => {
          const Icon = socialIcon(link);
          return (
            <a
              key={link.kind}
              href={socialHref(link)}
              className="social-icon text-muted hover:text-accent flex items-center transition-colors duration-150"
              aria-label={link.kind}
              target={link.kind === 'email' ? undefined : '_blank'}
              rel={link.kind === 'email' ? undefined : 'noopener'}
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default withStrictMode(AuthorBio);
