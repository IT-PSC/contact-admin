import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth";
import { getBackendUrl } from "@/lib/backend";

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData();
    const outgoing = new FormData();
    for (const [key, value] of incoming.entries()) {
      outgoing.append(key, value);
    }

    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    const headers = new Headers();
    if (token) headers.set("authorization", `Bearer ${token}`);

    const res = await fetch(`${getBackendUrl()}/api/upload`, {
      method: "POST",
      headers,
      body: outgoing,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
