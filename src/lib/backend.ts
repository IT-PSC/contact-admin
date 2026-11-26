import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE } from "./auth";
import type {
  CompanyInput,
  CompanySettings,
  Department,
  Employee,
  EmployeeInput,
  Language,
} from "./types";

export function getBackendUrl() {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000"
  );
}

export function mediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBackendUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

async function authHeaders(): Promise<HeadersInit> {
  const jar = await cookies();
  const token = jar.get(ADMIN_TOKEN_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const auth = await authHeaders();
  for (const [key, value] of Object.entries(auth)) {
    if (!headers.has(key)) headers.set(key, value);
  }

  const url = `${getBackendUrl()}${path}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_RETRIES) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : `Backend error (${res.status})`,
        );
      }
      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isNetwork =
        lastError.name === "TypeError" ||
        /fetch failed|ECONNREFUSED|ETIMEDOUT|network/i.test(lastError.message);
      if (isNetwork && attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error("Backend unavailable");
}

export async function getCompany(): Promise<CompanySettings> {
  return backendFetch("/api/company");
}

export async function updateCompany(input: CompanyInput): Promise<CompanySettings> {
  return backendFetch("/api/company", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function listDepartments(): Promise<Department[]> {
  return backendFetch("/api/departments");
}

export async function listLanguages(): Promise<Language[]> {
  return backendFetch("/api/languages");
}

export async function listEmployees(): Promise<Employee[]> {
  return backendFetch("/api/employees");
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const headers = await authHeaders();
  const res = await fetch(`${getBackendUrl()}/api/employees/${id}`, {
    headers,
    cache: "no-store",
  });
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Failed to load employee",
    );
  }
  return data as Employee;
}

export type CardPayload = {
  employee: Employee;
  company: CompanySettings;
  departmentName: string;
};

export async function getPublicCard(slug: string): Promise<CardPayload | null> {
  const res = await fetch(
    `${getBackendUrl()}/api/public/cards/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Failed to load card");
  }
  return data as CardPayload;
}

export async function createEmployee(input: EmployeeInput): Promise<Employee> {
  return backendFetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export type AdminPublic = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentAdmin(): Promise<AdminPublic | null> {
  try {
    const data = await backendFetch<{ admin: AdminPublic }>("/api/auth/me");
    return data.admin;
  } catch {
    return null;
  }
}
