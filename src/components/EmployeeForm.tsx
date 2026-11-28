"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  CONTACT_TYPE_OPTIONS,
  contactsFromEmployee,
  emptyContact,
  legacyFieldsFromContacts,
  sanitizeContacts,
} from "@/lib/contacts";
import {
  DEFAULT_LANGUAGE_OPTIONS,
  languagesToOptions,
  slugifyLanguage,
  spokenLanguageLabel,
} from "@/lib/languages";
import type {
  ContactLink,
  ContactType,
  Department,
  Employee,
  Language,
  SpokenLanguage,
} from "@/lib/types";
import { Avatar } from "./Avatar";
import { ImageUpload } from "./ImageUpload";
import { useLocale } from "./LocaleProvider";

type Props = {
  departments: Department[];
  languages?: Language[];
  employee?: Employee;
};

export function EmployeeForm({ departments, languages = [], employee }: Props) {
  const router = useRouter();
  const { t, format } = useLocale();
  const [name, setName] = useState(employee?.name ?? "");
  const [bio, setBio] = useState(employee?.bio ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [departmentId, setDepartmentId] = useState(
    employee?.departmentId ?? departments[0]?.id ?? "",
  );
  const [email, setEmail] = useState(employee?.email ?? "");
  const [photoUrl, setPhotoUrl] = useState(employee?.photoUrl ?? "");
  const [contacts, setContacts] = useState<ContactLink[]>(() =>
    contactsFromEmployee(employee),
  );
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

  const previewName = useMemo(
    () => name.trim() || t.employeeForm.newEmployee,
    [name, t.employeeForm.newEmployee],
  );
  const departmentName =
    departments.find((d) => d.id === departmentId)?.name || t.employeeForm.department;

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
      if (!res.ok) throw new Error(data.error || t.employeeForm.addLanguageFailed);

      const option = { value: data.slug as string, label: data.name as string };
      setLanguageOptions((prev) =>
        [...prev, option].sort((a, b) => a.label.localeCompare(b.label)),
      );
      setSpokenLanguages((prev) =>
        prev.includes(option.value) ? prev : [...prev, option.value],
      );
      setNewLanguage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.employeeForm.addLanguageFailed,
      );
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
      if (!res.ok) throw new Error(data.error || t.common.uploadFailed);
      setPhotoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  function updateContact(id: string, patch: Partial<ContactLink>) {
    setContacts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addContact() {
    setContacts((prev) => [...prev, emptyContact("website")]);
  }

  function removeContact(id: string) {
    setContacts((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0 ? next : [emptyContact("phone")];
    });
  }

  function typeLabel(type: ContactType) {
    const map: Record<ContactType, string> = {
      phone: t.employeeForm.phone,
      telegram: t.employeeForm.telegram,
      facebook: t.employeeForm.facebook,
      tiktok: t.employeeForm.tiktok,
      linkedin: t.employeeForm.linkedin,
      whatsapp: t.employeeForm.whatsapp,
      instagram: t.employeeForm.instagram,
      website: t.employeeForm.website,
      custom: t.employeeForm.custom,
    };
    return map[type];
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const cleaned = sanitizeContacts(contacts);
      const legacy = legacyFieldsFromContacts(cleaned);
      const payload = {
        name,
        bio,
        position,
        departmentId,
        email,
        photoUrl,
        ...legacy,
        contacts: cleaned,
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
      if (!res.ok) throw new Error(data.error || t.common.saveFailed);
      router.push("/employees");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
      <div className="space-y-5">
        <section className="surface animate-rise space-y-5 p-6 md:p-8">
          <div>
            <h2 className="type-section">{t.employeeForm.profile}</h2>
            <p className="type-helper mt-1 text-[var(--muted)]">
              {t.employeeForm.profileHint}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">
                {t.employeeForm.fullName}
              </span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bobby Tandy"
                required
              />
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="type-label text-[var(--muted)]">{t.employeeForm.bio}</span>
              <textarea
                className="field min-h-[110px] resize-y"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.employeeForm.bioPlaceholder}
              />
            </label>

            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">
                {t.employeeForm.position}
              </span>
              <input
                className="field"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={t.employeeForm.positionPlaceholder}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="type-label text-[var(--muted)]">
                {t.employeeForm.department}
              </span>
              <select
                className="field"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                {departments.length === 0 ? (
                  <option value="">{t.employeeForm.addDeptFirst}</option>
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
              <span className="type-label text-[var(--muted)]">
                {t.employeeForm.workEmail}
              </span>
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

        <section
          className="surface animate-rise space-y-4 p-6 md:p-8"
          style={{ animationDelay: "0.04s" }}
        >
          <div>
            <h2 className="type-section">{t.employeeForm.languagesKnown}</h2>
            <p className="type-helper mt-1 text-[var(--muted)]">
              {t.employeeForm.languagesHint}
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
              placeholder={t.employeeForm.addLanguagePlaceholder}
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
              {addingLanguage
                ? t.employeeForm.addingLanguage
                : t.employeeForm.addLanguage}
            </button>
          </div>
        </section>

        <section
          className="surface animate-rise space-y-5 p-6 md:p-8"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="type-section">{t.employeeForm.personalContact}</h2>
              <p className="type-helper mt-1 text-[var(--muted)]">
                {t.employeeForm.personalContactHint}
              </p>
            </div>
            <button type="button" className="btn btn-ghost" onClick={addContact}>
              {t.employeeForm.addMoreContact}
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="grid gap-3 rounded-2xl border border-[rgba(212,175,55,0.14)] bg-black/20 p-4 md:grid-cols-[180px_1fr_auto]"
              >
                <label className="block space-y-2">
                  <span className="type-label text-[var(--muted)]">
                    {t.employeeForm.contactType}
                  </span>
                  <select
                    className="field"
                    value={contact.type}
                    onChange={(e) =>
                      updateContact(contact.id, {
                        type: e.target.value as ContactType,
                      })
                    }
                  >
                    {CONTACT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {typeLabel(option.value)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {contact.type === "custom" ? (
                    <label className="block space-y-2">
                      <span className="type-label text-[var(--muted)]">
                        {t.employeeForm.customLabel}
                      </span>
                      <input
                        className="field"
                        value={contact.label}
                        onChange={(e) =>
                          updateContact(contact.id, { label: e.target.value })
                        }
                        placeholder="Line / WeChat"
                      />
                    </label>
                  ) : null}
                  <label
                    className={`block space-y-2 ${
                      contact.type === "custom" ? "" : "sm:col-span-2"
                    }`}
                  >
                    <span className="type-label text-[var(--muted)]">
                      {t.employeeForm.contactValue}
                    </span>
                    <input
                      className="field"
                      value={contact.value}
                      onChange={(e) =>
                        updateContact(contact.id, { value: e.target.value })
                      }
                      placeholder={
                        contact.type === "phone" || contact.type === "whatsapp"
                          ? "096 7777 256"
                          : contact.type === "telegram"
                            ? "t.me/username"
                            : "https://..."
                      }
                    />
                  </label>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    className="btn btn-danger w-full md:w-auto"
                    onClick={() => removeContact(contact.id)}
                  >
                    {t.employeeForm.removeContact}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <p className="type-body rounded-xl bg-[rgba(255,107,107,0.1)] px-4 py-3 text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" type="submit" disabled={saving || !departmentId}>
            {saving
              ? t.common.saving
              : employee
                ? t.employeeForm.updateEmployee
                : t.employeeForm.createEmployee}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => router.push("/employees")}
          >
            {t.common.cancel}
          </button>
        </div>
      </div>

      <aside className="animate-rise space-y-4 self-start" style={{ animationDelay: "0.08s" }}>
        <div className="surface overflow-hidden p-6">
          <p className="type-helper font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            {t.employeeForm.preview}
          </p>
          <div className="mt-5 flex flex-col items-center text-center">
            <Avatar name={previewName} logoUrl={photoUrl} size="lg" />
            <h2 className="type-page-title mt-4">
              {format(t.employeeForm.helloIm, { name: previewName })}
            </h2>
            <p className="type-body mt-2 text-[var(--muted)]">
              {bio.trim() || t.employeeForm.bioPlaceholderPreview}
            </p>
            <div className="type-body mt-4 w-full space-y-2 text-left">
              {[
                [t.employeeForm.labelName, previewName],
                [
                  t.employeeForm.labelPosition,
                  position.trim() || t.employeeForm.position,
                ],
                [t.employeeForm.labelDepartment, departmentName],
                [t.employeeForm.labelEmail, email.trim() || "email@company.com"],
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
                <p className="type-helper text-[var(--muted)]">
                  {t.employeeForm.languagesAppearHere}
                </p>
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
            label={t.employeeForm.profilePhoto}
            hint={t.employeeForm.profilePhotoHint}
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
