/// <reference types="astro/client" />

declare const __GIT_HASH__: string;

interface Env {
  UMAMI_API_URL: string;
  UMAMI_WEBSITE_ID: string;
  UMAMI_API_KEY: string;
  UMAMI_USERNAME: string;
  UMAMI_PASSWORD: string;
  UMAMI_SCRIPT_URL?: string;

  // GitHub-powered admin login + publishing (see src/pages/admin, src/pages/api/admin, src/pages/api/auth)
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_OWNER_ID: string; // numeric GitHub user id allowed to write posts
  GITHUB_TOKEN: string; // repo-scoped token used for the Contents API
  GITHUB_REPO: `${string}/${string}`; // "owner/repo" — the content repo, may differ from the platform repo
  GITHUB_BRANCH: string; // branch to commit to — must match what that repo's deploy workflow watches
  SESSION_SECRET: string; // HMAC signing key for the admin session cookie
  DRAFTS: import('@cloudflare/workers-types').KVNamespace;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    locale: import('$/i18n/ui').Locale;
    /** Preferred language for article content, independent of UI locale. */
    articleLocale: import('$/i18n/ui').Locale;
  }
}
