"use client";

export function getBackendUrl() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000"
  );
}

export function getContactWebUrl() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_WEB_URL?.replace(/\/$/, "") ||
    "http://localhost:3001"
  );
}

/** Physical card first view (print-style). */
export function cardUrl(slug: string) {
  return `${getContactWebUrl()}/card/${slug}`;
}

/** Digital namecard — encoded in QR codes for scanning. */
export function digitalCardUrl(slug: string) {
  return `${getContactWebUrl()}/card/${slug}/digital`;
}

export function mediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBackendUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

/** Prefer same-origin admin proxy routes so cookies/CORS stay simple. */
export function apiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
