import React from 'react';
import { author } from '#/dynamic.config';
import { socialHref, socialIcon } from '$/utils/social';
import withStrictMode from '$/components/withStrictMode';

function AuthorBio() {
  return (
    <div
      className="@container flex cursor-pointer flex-col gap-2 px-4 py-2 transition-opacity duration-150 hover:opacity-80"
      onClick={() => {
        window.location.href = '/articles/about-me';
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.location.href = '/articles/about-me';
        }
      }}
      aria-label="About me"
    >
      <div className="flex flex-col items-center gap-2 @[160px]:flex-row @[160px]:gap-3">
        <img
          className="border-border h-12 w-12 shrink-0 rounded-full border-2 object-cover"
          src={author.avatar}
          alt="Author avatar"
          width="48"
          height="48"
          loading="eager"
        />
        <div className="flex min-w-0 flex-col gap-0.5 text-center @[160px]:text-left">
          <span className="text-foreground text-sm font-semibold">{author.name}</span>
          <span className="text-muted text-xs leading-[1.4]">{author.tagline}</span>
        </div>
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
              onClick={(e) => e.stopPropagation()}
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
