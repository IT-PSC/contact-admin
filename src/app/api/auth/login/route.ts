import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth";
import { getBackendUrl } from "@/lib/backend";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${getBackendUrl()}/api/auth/login`;
    let res: Response | null = null;
    let data: { error?: string; admin?: unknown; token?: string } = {};

    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      data = await res.json().catch(() => ({}));
      if (res.ok || ![502, 503, 504].includes(res.status)) break;
      await sleep(1500 * (attempt + 1));
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        {
          error:
            data.error ||
            (res && [502, 503, 504].includes(res.status)
              ? "Backend unavailable. Wait for the API to wake, then try again."
              : "Login failed"),
        },
        { status: res?.status && res.status >= 400 ? res.status : 502 },
      );
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "Login response missing token" },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      admin: data.admin,
      ok: true,
    });

    response.cookies.set(ADMIN_TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 500 },
    );
  }
}
