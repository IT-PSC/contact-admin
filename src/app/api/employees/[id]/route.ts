import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/api/employees/${id}`, { method: "GET" });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/api/employees/${id}`);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/api/employees/${id}`, { method: "DELETE" });
}
