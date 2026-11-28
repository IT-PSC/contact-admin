import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth";
import { proxyToBackend } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/me", { method: "GET" });
}

export async function PUT(request: NextRequest) {
  const upstream = await proxyToBackend(request, "/api/auth/me");
  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(
      { error: typeof data?.error === "string" ? data.error : "Update failed" },
      { status: upstream.status },
    );
  }

  const response = NextResponse.json({
    admin: data.admin,
    ok: true,
  });

  if (typeof data?.token === "string" && data.token) {
    response.cookies.set(ADMIN_TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
