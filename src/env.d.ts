/// <reference types="astro/client" />

declare const __GIT_HASH__: string;

declare namespace App {
  interface Locals {
    locale: import('$/i18n/ui').Locale;
  }
}
