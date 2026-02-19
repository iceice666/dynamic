/// <reference types="astro/client" />

declare const __GIT_HASH__: string;

interface Env {
  UMAMI_API_URL: string;
  UMAMI_WEBSITE_ID: string;
  UMAMI_API_KEY: string;
  UMAMI_USERNAME: string;
  UMAMI_PASSWORD: string;
  UMAMI_SCRIPT_URL?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    locale: import('$/i18n/ui').Locale;
    /** Preferred language for article content, independent of UI locale. */
    articleLocale: import('$/i18n/ui').Locale;
  }
}
