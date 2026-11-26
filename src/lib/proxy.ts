import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "./auth";
import { getBackendUrl } from "./backend";

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  init?: RequestInit,
) {
  const method = (init?.method || request.method).toUpperCase();
  const url = `${getBackendUrl()}${backendPath}`;
  const headers = new Headers(init?.headers);

  const contentType = request.headers.get("content-type");
  if (
    contentType &&
    !headers.has("content-type") &&
    method !== "GET" &&
    method !== "HEAD"
  ) {
    headers.set("content-type", contentType);
  }

  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
  }

  let body: string | undefined;
  if (!init?.body && method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    body = await request.text();
  } else if (typeof init?.body === "string") {
    body = init.body;
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const responseHeaders = new Headers();
  for (const key of ["content-type", "content-disposition", "cache-control"]) {
    const value = res.headers.get(key);
    if (value) responseHeaders.set(key, value);
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    status: res.status,
    headers: responseHeaders,
  });
}
