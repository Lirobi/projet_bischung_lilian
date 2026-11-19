/** Seules les URL internes sont acceptées, pour éviter une redirection vers un autre site. */
export function safeReturnUrl(url: string | null | undefined, fallback = '/pollutions'): string {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\') ? url : fallback;
}
