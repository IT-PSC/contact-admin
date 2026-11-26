import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  return proxyToBackend(
    request,
    `/api/public/cards/${encodeURIComponent(slug)}/vcard`,
    { method: "GET" },
  );
}
