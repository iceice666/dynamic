import type { SocialLink } from '$/types';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function socialHref(link: SocialLink): string {
  if (link.kind === 'email') return `mailto:${link.address}`;
  return link.url;
}

export function socialIcon(link: SocialLink): LucideIcon {
  const icons: Record<SocialLink['kind'], LucideIcon> = {
    website: LucideIcons['Globe'],
    github: LucideIcons['Github'],
    gitlab: LucideIcons['Gitlab'],
    git: LucideIcons['GitBranch'],
    twitter: LucideIcons['Twitter'],
    linkedin: LucideIcons['Linkedin'],
    rss: LucideIcons['Rss'],
    facebook: LucideIcons['Facebook'],
    instagram: LucideIcons['Instagram'],
    threads: LucideIcons['MessageCircle'],
    youtube: LucideIcons['Youtube'],
    email: LucideIcons['Mail'],
  };

  return icons[link.kind];
}
