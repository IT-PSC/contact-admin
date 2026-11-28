"use client";

import type { AdminPublic } from "@/lib/backend";
import { AdminProfileForm } from "./AdminProfileForm";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function ProfilePageClient({ admin }: { admin: AdminPublic }) {
  const { t } = useLocale();
  const initial = admin.name.trim().slice(0, 1).toUpperCase() || "A";

  return (
    <div>
      <PageHeader
        eyebrow={t.profile.eyebrow}
        title={t.profile.title}
        description={t.profile.description}
      />

      <section className="surface animate-rise relative mb-6 overflow-hidden p-6 md:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#1a1a1a_0%,#d4af37_100%)] text-[22px] font-bold text-black shadow-[0_12px_30px_rgba(212,175,55,0.25)]">
                {initial}
              </div>
              <span
                aria-hidden
                className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-[var(--panel-elevated)] bg-[#3ecf8e]"
              />
            </div>
            <div className="min-w-0">
              <p className="type-helper font-medium uppercase tracking-[0.16em] text-[#d4af37]/80">
                {t.shell.profile}
              </p>
              <h2 className="type-section mt-1 truncate text-[#f0d78c]">{admin.name}</h2>
              <p className="type-body mt-1 truncate text-[var(--muted)]">{admin.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[240px]">
            <div className="rounded-2xl border border-[rgba(212,175,55,0.14)] bg-black/25 px-4 py-3">
              <p className="type-helper uppercase tracking-[0.14em] text-white/40">
                {t.profile.name}
              </p>
              <p className="type-card-title mt-1 truncate">{admin.name}</p>
            </div>
            <div className="rounded-2xl border border-[rgba(212,175,55,0.14)] bg-black/25 px-4 py-3">
              <p className="type-helper uppercase tracking-[0.14em] text-white/40">
                {t.login.email}
              </p>
              <p className="type-card-title mt-1 truncate">{admin.email}</p>
            </div>
          </div>
        </div>
      </section>

      <AdminProfileForm admin={admin} />
    </div>
  );
}
