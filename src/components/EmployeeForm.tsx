"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE_OPTIONS,
  languagesToOptions,
  slugifyLanguage,
  spokenLanguageLabel,
} from "@/lib/languages";
import type { Department, Employee, Language, SpokenLanguage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { ImageUpload } from "./ImageUpload";

type Props = {
  departments: Department[];
  languages?: Language[];
  employee?: Employee;
};

export function EmployeeForm({ departments, languages = [], employee }: Props) {
  const router = useRouter();
  const [name, setName] = useState(employee?.name ?? "");
  const [bio, setBio] = useState(employee?.bio ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [departmentId, setDepartmentId] = useState(
    employee?.departmentId ?? departments[0]?.id ?? "",
  );
  const [email, setEmail] = useState(employee?.email ?? "");
  const [photoUrl, setPhotoUrl] = useState(employee?.photoUrl ?? "");
  const [phone, setPhone] = useState(employee?.phone ?? "");
  const [telegram, setTelegram] = useState(employee?.telegram ?? "");
  const [facebook, setFacebook] = useState(employee?.facebook ?? "");
  const [tiktok, setTiktok] = useState(employee?.tiktok ?? "");
  const [linkedin, setLinkedin] = useState(employee?.linkedin ?? "");
  const [spokenLanguages, setSpokenLanguages] = useState<SpokenLanguage[]>(
    employee?.spokenLanguages ?? [],
  );
  const [languageOptions, setLanguageOptions] = useState(() => {
    const fromApi = languagesToOptions(languages);
    return fromApi.length > 0 ? fromApi : DEFAULT_LANGUAGE_OPTIONS;
  });
  const [newLanguage, setNewLanguage] = useState("");
  const [addingLanguage, setAddingLanguage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewName = useMemo(() => name.trim() || "New employee", [name]);
  const departmentName =
    departments.find((d) => d.id === departmentId)?.name || "Department";

  function toggleLanguage(code: SpokenLanguage) {
    setSpokenLanguages((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code],
    );
  }

  async function onAddLanguage() {
    const label = newLanguage.trim();
    if (!label) return;
    setAddingLanguage(true);
    setError("");
    try {
      const slug = slugifyLanguage(label);
      const existing = languageOptions.find(
        (option) =>
          option.value === slug ||
          option.label.toLowerCase() === label.toLowerCase(),
      );
      if (existing) {
        if (!spokenLanguages.includes(existing.value)) {
          setSpokenLanguages((prev) => [...prev, existing.value]);
        }
        setNewLanguage("");
        return;
      }

      const res = await fetch("/api/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add language");

      const option = { value: data.slug as string, label: data.name as string };
      setLanguageOptions((prev) =>
        [...prev, option].sort((a, b) => a.label.localeCompare(b.label)),
      );
      setSpokenLanguages((prev) =>
        prev.includes(option.value) ? prev : [...prev, option.value],
      );
      setNewLanguage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add language");
    } finally {
      setAddingLanguage(false);
    }
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
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
    try {
      const payload = {
        name,
        bio,
        position,
        departmentId,
        email,
        photoUrl,
        phone,
        telegram,
        facebook,
        tiktok,
        linkedin,
        spokenLanguages,
      };
      const res = await fetch(
        employee ? `/api/employees/${employee.id}` : "/api/employees",
        {
          method: employee ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/employees");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
      <div className="space-y-5">
        <section className="surface animate-rise space-y-5 p-6 md:p-8">
          <div>
            <h2 className="type-section">Profile</h2>
            <p className="type-helper mt-1 text-[var(--muted)]">
              These fields appear on the public digital namecard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">Full name</span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bobby Tandy"
                required
              />
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">Bio / introduction</span>
              <textarea
                className="field min-h-[110px] resize-y"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short intro under the greeting"
              />
            </label>

            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">Position</span>
              <input
                className="field"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Project manager"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">Department</span>
              <select
                className="field"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                {departments.length === 0 ? (
                  <option value="">Add a department first</option>
                ) : (
                  departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">Work email</span>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </label>
          </div>
        </section>

        <section className="surface animate-rise space-y-4 p-6 md:p-8" style={{ animationDelay: "0.04s" }}>
          <div>
            <h2 className="type-section">Languages known</h2>
            <p className="type-helper mt-1 text-[var(--muted)]">
              Select languages this employee can speak, or add a new one.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((option) => {
              const active = spokenLanguages.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleLanguage(option.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--accent)] text-black"
                      : "border border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className="field sm:max-w-xs"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add new language (e.g. Spanish)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void onAddLanguage();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-ghost"
              disabled={addingLanguage || !newLanguage.trim()}
              onClick={() => void onAddLanguage()}
            >
              {addingLanguage ? "Adding..." : "Add language"}
            </button>
          </div>
        </section>

        <section className="surface animate-rise space-y-5 p-6 md:p-8" style={{ animationDelay: "0.08s" }}>
          <div>
            <h2 className="type-section">Personal contact</h2>
            <p className="type-helper mt-1 text-[var(--muted)]">
              Phone and social links shown in the namecard contact section.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">Phone</span>
              <input
                className="field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="096 7777 256"
              />
            </label>
            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">Telegram</span>
              <input
                className="field"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="t.me/username"
              />
            </label>
            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">Facebook</span>
              <input
                className="field"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="www.facebook.com/username"
              />
            </label>
            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">TikTok</span>
              <input
                className="field"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="www.tiktok.com/@username"
              />
            </label>
            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">LinkedIn</span>
              <input
                className="field"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="www.linkedin.com/in/username"
              />
            </label>
          </div>
        </section>

        {error ? (
          <p className="type-body rounded-xl bg-[rgba(255,107,107,0.1)] px-4 py-3 text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" type="submit" disabled={saving || !departmentId}>
            {saving ? "Saving..." : employee ? "Update employee" : "Create employee"}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => router.push("/employees")}
          >
            Cancel
          </button>
        </div>
      </div>

      <aside className="animate-rise space-y-4 self-start" style={{ animationDelay: "0.08s" }}>
        <div className="surface overflow-hidden p-6">
          <p className="type-helper font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Namecard preview
          </p>
          <div className="mt-5 flex flex-col items-center text-center">
            <Avatar name={previewName} logoUrl={photoUrl} size="lg" />
            <h2 className="type-page-title mt-4">HELLO! I&apos;m {previewName}.</h2>
            <p className="type-body mt-2 text-[var(--muted)]">
              {bio.trim() || "Bio / introduction appears here"}
            </p>
            <div className="type-body mt-4 w-full space-y-2 text-left">
              {[
                ["NAME", previewName],
                ["POSITION", position.trim() || "Position"],
                ["DEPARTMENT", departmentName],
                ["EMAIL", email.trim() || "email@company.com"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-full border border-[rgba(212,175,55,0.18)] bg-black/35 px-4 py-2.5"
                >
                  <span className="type-helper font-medium tracking-wide text-[var(--muted)]">
                    {label}
                  </span>
                  <span className="type-body truncate font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex w-full flex-wrap gap-2">
              {spokenLanguages.length === 0 ? (
                <p className="type-helper text-[var(--muted)]">Languages known appear here</p>
              ) : (
                spokenLanguages.map((code) => (
                  <span key={code} className="badge">
                    {spokenLanguageLabel(
                      code,
                      languageOptions.map((o) => ({
                        id: o.value,
                        name: o.label,
                        slug: o.value,
                        createdAt: "",
                      })),
                    )}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <ImageUpload
            label="Profile photo"
            hint="Circular portrait on the namecard. PNG/JPG up to 2MB."
            value={photoUrl}
            uploading={uploading}
            onUpload={onUpload}
            onClear={() => setPhotoUrl("")}
            previewShape="circle"
          />
        </div>
      </aside>
    </form>
  );
}
