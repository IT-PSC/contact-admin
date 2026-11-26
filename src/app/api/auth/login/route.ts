import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth";
import { getBackendUrl } from "@/lib/backend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Login failed" },
        { status: res.status },
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
