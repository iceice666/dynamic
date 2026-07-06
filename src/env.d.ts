/// <reference types="astro/client" />

import type { Runtime } from '@astrojs/cloudflare';
import type { Locale } from '$/i18n/ui';

declare global {
  const __GIT_HASH__: string;

  interface DynamicEnvBindings {
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
  }

  interface Env extends DynamicEnvBindings {}

  namespace Cloudflare {
    interface Env extends DynamicEnvBindings {}
  }

  namespace App {
    interface Locals extends Runtime {
      locale: Locale;
      /** Preferred language for article content, independent of UI locale. */
      articleLocale: Locale;
    }
  }
}

export {};
