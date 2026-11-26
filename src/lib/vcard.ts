import type { CompanySettings, Employee } from "./types";
import { spokenLanguageLabel } from "./languages";

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function ensureUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("t.me/")) return `https://${trimmed}`;
  return `https://${trimmed}`;
}

export function buildVCard(employee: Employee, company: CompanySettings): string {
  const languageNote =
    employee.spokenLanguages.length > 0
      ? `Languages: ${employee.spokenLanguages.map((code) => spokenLanguageLabel(code)).join(", ")}`
      : "";
  const noteParts = [employee.bio.trim(), languageNote].filter(Boolean);

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(employee.name)}`,
    `N:${escapeVCard(employee.name)};;;;`,
    `ORG:${escapeVCard(company.name)}`,
    `TITLE:${escapeVCard(employee.position)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(employee.email)}`,
  ];

  if (employee.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCard(employee.phone)}`);
  }
  if (noteParts.length > 0) {
    lines.push(`NOTE:${escapeVCard(noteParts.join(" | "))}`);
  }

  const urls = [
    employee.telegram,
    employee.facebook,
    employee.tiktok,
    employee.linkedin,
  ]
    .map(ensureUrl)
    .filter(Boolean);

  for (const url of urls) {
    lines.push(`URL:${escapeVCard(url)}`);
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function ensureExternalHref(value: string, kind: "phone" | "url" | "email"): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (kind === "phone") return `tel:${trimmed.replace(/\s+/g, "")}`;
  if (kind === "email") return `mailto:${trimmed}`;
  return ensureUrl(trimmed);
}
