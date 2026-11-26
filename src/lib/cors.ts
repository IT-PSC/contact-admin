import { NextResponse } from "next/server";

function allowedOrigins(): string[] {
  const fromEnv = [
    process.env.CONTACT_WEB_URL,
    process.env.NEXT_PUBLIC_CONTACT_WEB_URL,
  ]
    .filter(Boolean)
    .map((value) => String(value).replace(/\/$/, ""));

  return Array.from(
    new Set([
      ...fromEnv,
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ]),
  );
}

export function corsHeaders(requestOrigin: string | null): HeadersInit {
  const allowed = allowedOrigins();
  const origin =
    requestOrigin && allowed.includes(requestOrigin.replace(/\/$/, ""))
      ? requestOrigin
      : allowed[0] || "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function withCors(response: NextResponse, requestOrigin: string | null) {
  const headers = corsHeaders(requestOrigin);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function preflight(requestOrigin: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(requestOrigin),
  });
}
