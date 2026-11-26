import type { Language, SpokenLanguage } from "./types";

export const DEFAULT_LANGUAGE_OPTIONS: {
  value: SpokenLanguage;
  label: string;
}[] = [
  { value: "khmer", label: "Khmer" },
  { value: "english", label: "English" },
  { value: "chinese", label: "Chinese" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "thai", label: "Thai" },
  { value: "french", label: "French" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
];

/** @deprecated Prefer Language[] from API — kept for offline fallback. */
export const SPOKEN_LANGUAGE_OPTIONS = DEFAULT_LANGUAGE_OPTIONS;

export function slugifyLanguage(raw: string): string {
  return String(raw)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function spokenLanguageLabel(
  code: SpokenLanguage,
  catalog?: Language[],
): string {
  const fromCatalog = catalog?.find((item) => item.slug === code)?.name;
  if (fromCatalog) return fromCatalog;
  const preset = DEFAULT_LANGUAGE_OPTIONS.find((o) => o.value === code)?.label;
  if (preset) return preset;
  return code
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function languagesToOptions(languages: Language[]) {
  return languages.map((lang) => ({
    value: lang.slug,
    label: lang.name,
  }));
}

export function normalizeSpokenLanguages(raw: unknown): SpokenLanguage[] {
  if (!Array.isArray(raw)) return [];
  const unique: SpokenLanguage[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const slug = slugifyLanguage(String(item ?? ""));
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    unique.push(slug);
    if (unique.length >= 24) break;
  }
  return unique;
}
