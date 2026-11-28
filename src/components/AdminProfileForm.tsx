"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminPublic } from "@/lib/backend";
import { useLocale } from "./LocaleProvider";

export function AdminProfileForm({ admin }: { admin: AdminPublic }) {
  const router = useRouter();
  const { t } = useLocale();

  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileSaved(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.common.saveFailed);
      setName(data.admin.name);
      setEmail(data.admin.email);
      setProfileSaved(true);
      router.refresh();
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : t.common.saveFailed);
    } finally {
      setProfileSaving(false);
    }
  }

  async function onChangePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (newPassword.length < 8) {
      setPasswordError(t.profile.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.profile.passwordMismatch);
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.common.saveFailed);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t.common.saveFailed);
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={onSaveProfile}
        className="surface animate-rise relative overflow-hidden space-y-5 p-6 md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
        />
        <div>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[#d4af37]/75">
            01
          </p>
          <h2 className="type-section mt-1">{t.profile.detailsTitle}</h2>
          <p className="type-helper mt-1 text-[var(--muted)]">{t.profile.detailsHint}</p>
        </div>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.profile.name}</span>
          <input
            className="field"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setProfileSaved(false);
            }}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.profile.email}</span>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setProfileSaved(false);
            }}
            required
          />
        </label>

        {profileError ? (
          <p className="type-body rounded-xl bg-[rgba(255,107,107,0.1)] px-4 py-3 text-[var(--danger)]">
            {profileError}
          </p>
        ) : null}
        {profileSaved ? (
          <p className="type-body rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[var(--accent-strong)]">
            {t.profile.profileSaved}
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={profileSaving}>
          {profileSaving ? t.common.saving : t.profile.saveProfile}
        </button>
      </form>

      <form
        onSubmit={onChangePassword}
        className="surface animate-rise relative overflow-hidden space-y-5 p-6 md:p-8"
        style={{ animationDelay: "0.06s" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
        />
        <div>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[#d4af37]/75">
            02
          </p>
          <h2 className="type-section mt-1">{t.profile.passwordTitle}</h2>
          <p className="type-helper mt-1 text-[var(--muted)]">{t.profile.passwordHint}</p>
        </div>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.profile.currentPassword}</span>
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setPasswordSaved(false);
            }}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.profile.newPassword}</span>
          <input
            className="field"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordSaved(false);
            }}
            required
            minLength={8}
          />
        </label>

        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">{t.profile.confirmPassword}</span>
          <input
            className="field"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordSaved(false);
            }}
            required
            minLength={8}
          />
        </label>

        {passwordError ? (
          <p className="type-body rounded-xl bg-[rgba(255,107,107,0.1)] px-4 py-3 text-[var(--danger)]">
            {passwordError}
          </p>
        ) : null}
        {passwordSaved ? (
          <p className="type-body rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[var(--accent-strong)]">
            {t.profile.passwordChanged}
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={passwordSaving}>
          {passwordSaving ? t.common.saving : t.profile.changePassword}
        </button>
      </form>
    </div>
  );
}
