"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanySettings } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";
import { useLocale } from "./LocaleProvider";

export function CompanySettingsForm({ company }: { company: CompanySettings }) {
  const router = useRouter();
  const { t } = useLocale();
  const [name, setName] = useState(company.name);
  const [slogan, setSlogan] = useState(company.slogan);
  const [logoUrl, setLogoUrl] = useState(company.logoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    setSaved(false);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.common.uploadFailed);
      setLogoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slogan, logoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.common.saveFailed);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="surface animate-rise space-y-5 p-6 md:p-8">
        <div>
          <h2 className="type-section">{t.company.brandTitle}</h2>
          <p className="type-helper mt-1 text-[var(--muted)]">{t.company.brandHint}</p>
        </div>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.company.companyName}</span>
          <input
            className="field"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            placeholder="SANDAI"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.company.slogan}</span>
          <input
            className="field"
            value={slogan}
            onChange={(e) => {
              setSlogan(e.target.value);
              setSaved(false);
            }}
            placeholder="SMART STRATEGY STRONGER TOMORROW"
          />
        </label>

        <ImageUpload
          label={t.company.logo}
          hint={t.company.logoHint}
          value={logoUrl}
          uploading={uploading}
          onUpload={onUpload}
          onClear={() => {
            setLogoUrl("");
            setSaved(false);
          }}
        />

        {error ? (
          <p className="type-body rounded-xl bg-[#fff5f4] px-4 py-3 text-[var(--danger)]">{error}</p>
        ) : null}
        {saved ? (
          <p className="type-body rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[var(--accent-strong)]">
            {t.company.saved}
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? t.common.saving : t.company.saveButton}
        </button>
      </div>

      <aside className="surface animate-rise p-6" style={{ animationDelay: "0.08s" }}>
        <p className="type-helper font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          {t.company.preview}
        </p>
        <div className="mt-6 flex flex-col items-center text-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="h-16 w-16 object-contain" />
          ) : (
            <div className="type-section flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#2a2a2a,#d4af37)] text-black">
              {(name.trim() || "S").slice(0, 1)}
            </div>
          )}
          <p className="type-page-title mt-3 tracking-[0.06em] text-[#f0d78c]">
            {name.trim() || t.company.companyFallback}
          </p>
          <p className="type-helper mt-4 max-w-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            {slogan.trim() || t.company.sloganFallback}
          </p>
        </div>
      </aside>
    </form>
  );
}
