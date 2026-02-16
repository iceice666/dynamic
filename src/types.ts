// Shared UI-facing types

export type SocialLink =
  | { kind: 'email'; address: string }
  | {
      kind:
        | 'website'
        | 'github'
        | 'gitlab'
        | 'git'
        | 'twitter'
        | 'linkedin'
        | 'rss'
        | 'facebook'
        | 'instagram'
        | 'threads'
        | 'youtube';
      url: string;
    };

export type Friend = {
  name: string;
  url: string;
  img: string;
  desc: string;
  socials: SocialLink[];
};

export type Author = {
  name: string;
  tagline: string;
  avatar: string;
  socials: SocialLink[];
};
