/**
 * Public address of the web app: canonical URLs, social previews, sitemap.
 * NEXT_PUBLIC_SITE_URL overrides it (e.g. a preview deployment).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medscribe.kioko.es"
).replace(/\/$/, "");
