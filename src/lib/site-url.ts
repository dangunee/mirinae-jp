/** Public site origin for newsletter links (no trailing slash). */
export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://mirinae.jp"
  );
}
