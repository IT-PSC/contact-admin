"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanySettings } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

export function CompanySettingsForm({ company }: { company: CompanySettings }) {
  const router = useRouter();
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
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setLogoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="surface animate-rise space-y-5 p-6 md:p-8">
        <div>
          <h2 className="type-section">
            Brand for namecards
          </h2>
          <p className="type-helper mt-1 text-[var(--muted)]">
            Company logo, name, and slogan appear on every employee namecard.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">Company name</span>
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
          <span className="type-label text-[var(--muted)]">Slogan</span>
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
          label="Company logo"
          hint="Shown at the top of each namecard."
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
            Company settings saved.
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save company settings"}
        </button>
      </div>

      <aside className="surface animate-rise p-6" style={{ animationDelay: "0.08s" }}>
        <p className="type-helper font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Preview
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
            {name.trim() || "Company"}
          </p>
          <p className="type-helper mt-4 max-w-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            {slogan.trim() || "Your slogan here"}
          </p>
        </div>
      </aside>
    </form>
  );
}
