export const ADMIN_TOKEN_COOKIE = "sandai_admin_token";

export function getTokenFromCookieHeader(cookieHeader: string | null): string {
  if (!cookieHeader) return "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === ADMIN_TOKEN_COOKIE) return decodeURIComponent(value);
  }
  return "";
}
