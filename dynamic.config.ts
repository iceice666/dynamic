import type { Author, Friend } from './src/types';

// --- Author ---

export const author: Author = {
  name: 'Ghost',
  tagline: 'Writing about things that matter.',
  avatar: 'https://github.com/ghost.png',
  socials: [
    { kind: 'github', url: 'https://github.com' },
    { kind: 'twitter', url: 'https://twitter.com' },
    { kind: 'rss', url: '/rss.xml' },
  ],
};

// --- Friends ---

export const friends: Friend[] = [
  {
    name: 'Lena Hartmann',
    url: 'https://lena.dev',
    img: 'https://github.com/lenahartmann.png',
    desc: 'Systems programmer, Rust evangelist, and occasional poet. Writes about low-level internals and the beauty of deterministic software.',
    socials: [
      { kind: 'website', url: 'https://lena.dev' },
      { kind: 'github', url: 'https://github.com/lenahartmann' },
      { kind: 'rss', url: 'https://lena.dev/rss.xml' },
    ],
  },
  {
    name: 'Marcus Osei',
    url: 'https://marcosei.xyz',
    img: 'https://github.com/marcosei.png',
    desc: 'Designer turned developer. Building open-source design tools and writing about the intersection of craft and code.',
    socials: [
      { kind: 'twitter', url: 'https://twitter.com/marcosei' },
      { kind: 'github', url: 'https://github.com/marcosei' },
      { kind: 'website', url: 'https://marcosei.xyz' },
    ],
  },
  {
    name: 'Yuki Tanaka',
    url: 'https://yuki.garden',
    img: 'https://github.com/yukitanaka.png',
    desc: 'Digital gardener. Thinking out loud about personal knowledge management, note-taking workflows, and the web as a creative medium.',
    socials: [
      { kind: 'website', url: 'https://yuki.garden' },
      { kind: 'rss', url: 'https://yuki.garden/feed.xml' },
      { kind: 'website', url: 'https://fosstodon.org/@yuki' },
    ],
  },
  {
    name: 'Sophie Leclerc',
    url: 'https://sophieleclerc.fr',
    img: 'https://github.com/sophieleclerc.png',
    desc: 'Freelance writer and essayist. Long-form pieces on technology, society, and the slow erosion of serendipity in algorithmic feeds.',
    socials: [
      { kind: 'website', url: 'https://sophieleclerc.fr' },
      { kind: 'linkedin', url: 'https://linkedin.com/in/sophieleclerc' },
      { kind: 'email', address: 'sophie@sophieleclerc.fr' },
    ],
  },
  {
    name: 'Arjun Mehta',
    url: 'https://arjunmehta.in',
    img: 'https://github.com/arjunmehta.png',
    desc: 'Full-stack developer with a soft spot for databases and distributed systems. Posts tutorials, war stories, and occasional hot takes.',
    socials: [
      { kind: 'github', url: 'https://github.com/arjunmehta' },
      { kind: 'twitter', url: 'https://twitter.com/arjunmehta_dev' },
      { kind: 'rss', url: 'https://arjunmehta.in/rss' },
    ],
  },
  {
    name: 'Priya Nair',
    url: 'https://priyanair.com',
    img: 'https://github.com/priyanair.png',
    desc: 'Open-source contributor and conference speaker. Writes about community building, burnout, and making tech more humane.',
    socials: [
      { kind: 'website', url: 'https://priyanair.com' },
      { kind: 'github', url: 'https://github.com/priyanair' },
      { kind: 'youtube', url: 'https://youtube.com/@priyanair' },
      { kind: 'email', address: 'priya@priyanair.com' },
    ],
  },
  {
    name: 'Felix Wagner',
    url: 'https://felixwagner.eu',
    img: 'https://github.com/felixwagner.png',
    desc: 'Security researcher and CTF enthusiast. Reverse engineering, vulnerability disclosure, and the occasional deep dive into binary exploitation.',
    socials: [
      { kind: 'gitlab', url: 'https://gitlab.com/felixwagner' },
      { kind: 'twitter', url: 'https://twitter.com/felixwagner_sec' },
      { kind: 'rss', url: 'https://felixwagner.eu/feed' },
    ],
  },
  {
    name: 'Camille Dupont',
    url: 'https://camille.blog',
    img: 'https://github.com/camilledupont.png',
    desc: 'Photographer and visual storyteller. Documents urban landscapes, quiet moments, and the textures of everyday life in Paris.',
    socials: [
      { kind: 'instagram', url: 'https://instagram.com/camilledupont' },
      { kind: 'website', url: 'https://camille.blog' },
      { kind: 'threads', url: 'https://threads.net/@camilledupont' },
    ],
  },
];
