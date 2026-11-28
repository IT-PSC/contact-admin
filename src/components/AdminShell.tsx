"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminPublic } from "@/lib/backend";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin?: AdminPublic | null;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile/");
  const initial = (admin?.name || "A").trim().slice(0, 1).toUpperCase();

  const nav = [
    { href: "/employees", label: t.shell.employees, hint: t.shell.employeesHint },
    {
      href: "/departments",
      label: t.shell.departments,
      hint: t.shell.departmentsHint,
    },
    { href: "/settings", label: t.shell.company, hint: t.shell.companyHint },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function HamburgerButton({ className = "" }: { className?: string }) {
    return (
      <button
        type="button"
        className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.22)] bg-black/25 text-[#f0d78c] transition hover:border-[rgba(212,175,55,0.4)] hover:bg-[rgba(212,175,55,0.08)] ${className}`}
        aria-label={menuOpen ? t.common.close : t.shell.contactAdmin}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="relative block h-3.5 w-4" aria-hidden>
          <span
            className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition ${
              menuOpen ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-0.5 w-4 rounded-full bg-current transition ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition ${
              menuOpen ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>
    );
  }

  function ProfileLink({ compact = false }: { compact?: boolean }) {
    return (
      <Link
        href="/profile"
        className={`group relative flex items-center gap-3 border-b pb-2 transition duration-200 ${
          compact ? "max-w-none gap-1.5 px-1 py-1" : "max-w-[320px]"
        } ${
          profileActive
            ? "border-[#D4AF37]"
            : "border-transparent hover:border-[#D4AF37]/55"
        }`}
        title={t.shell.profile}
      >
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#1a1a1a_0%,#d4af37_100%)] font-bold text-black shadow-[0_0_0_1px_rgba(212,175,55,0.35)] ${
            compact ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-[14px]"
          }`}
        >
          {initial}
          {!compact ? (
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-[#3ecf8e]"
            />
          ) : null}
        </span>
        <span
          className={`type-nav max-w-[160px] truncate whitespace-nowrap ${
            profileActive
              ? "text-[#f0d78c]"
              : "text-[var(--muted)] group-hover:text-[#f0d78c]"
          }`}
        >
          {admin?.name || t.shell.profile}
        </span>
      </Link>
    );
  }

  function SideNav({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="relative flex h-full flex-1 flex-col p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_70%)]"
        />

        <div className="relative mb-8 flex items-start justify-between gap-3">
          <Link href="/employees" className="group block" onClick={onNavigate}>
            <div className="flex items-center gap-3">
              <Image
                src="/sandai-logo.png"
                alt="SANDAI"
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-xl object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                priority
              />
              <div>
                <p className="type-section tracking-[0.06em] text-[#f0d78c]">SANDAI</p>
                <p className="type-helper mt-0.5 text-white/50">{t.shell.contactAdmin}</p>
              </div>
            </div>
          </Link>
          {onNavigate ? (
            <button
              type="button"
              className="type-helper rounded-lg px-2 py-1 text-white/50 hover:text-[#f0d78c] lg:hidden"
              onClick={onNavigate}
            >
              {t.common.close}
            </button>
          ) : null}
        </div>

        <nav className="relative space-y-2">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`block rounded-2xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-[rgba(212,175,55,0.12)] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.28)]"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="type-nav tracking-wide">{item.label}</span>
                  <span
                    className={`h-2 w-2 rounded-full transition-all ${
                      active
                        ? "bg-[#d4af37] shadow-[0_0_12px_#d4af37]"
                        : "bg-white/20"
                    }`}
                  />
                </div>
                <p className="type-helper mt-1 text-white/45">{item.hint}</p>
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto space-y-3">
          <LanguageToggle />
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1920px] gap-0 p-3 md:p-5 lg:gap-6">
      <aside
        className={`animate-fade sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(165deg,#050505_0%,#141414_52%,#0a0a0a_100%)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] lg:flex ${
          menuOpen ? "lg:hidden" : ""
        }`}
      >
        <SideNav />
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label={t.common.close}
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute bottom-3 left-3 top-3 flex w-[min(300px,85vw)] flex-col overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(165deg,#050505_0%,#141414_52%,#0a0a0a_100%)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <SideNav onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="animate-rise relative mb-5 flex items-center justify-between gap-4 border-b border-[rgba(212,175,55,0.28)] pb-4">
          <div className="flex items-center gap-3">
            <HamburgerButton />
            <Link href="/employees" className="flex items-center gap-2 lg:hidden">
              <Image
                src="/sandai-logo.png"
                alt="SANDAI"
                width={30}
                height={30}
                className="rounded-lg object-contain"
              />
              <span className="type-card-title tracking-[0.06em] text-[#f0d78c]">SANDAI</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <ProfileLink />
          </div>
          <div className="lg:hidden">
            <ProfileLink compact />
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
