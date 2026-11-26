"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const nav = [
  { href: "/employees", label: "Employees", hint: "Namecard profiles" },
  { href: "/departments", label: "Departments", hint: "Org structure" },
  { href: "/settings", label: "Company", hint: "Logo & slogan" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1920px] gap-0 p-3 md:p-5 lg:gap-6">
      <aside className="animate-fade sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(165deg,#050505_0%,#141414_52%,#0a0a0a_100%)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] lg:flex">
        <div className="relative flex flex-1 flex-col p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_70%)]"
          />

          <Link href="/employees" className="group relative mb-10 block">
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
                <p className="type-helper mt-0.5 text-white/50">Contact admin</p>
              </div>
            </div>
          </Link>

          <nav className="relative space-y-2">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
            <div className="rounded-2xl border border-[rgba(212,175,55,0.16)] bg-black/30 p-4">
              <p className="type-helper uppercase tracking-[0.18em] text-[#d4af37]/70">
                Brand
              </p>
              <p className="type-card-title mt-2 text-[#f0d78c]">Gold · Black</p>
              <p className="type-helper mt-1 leading-relaxed text-white/50">
                Colors and logo pulled from the SANDAI brand mark.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="mb-4 flex items-center justify-between gap-3 rounded-[22px] border border-[rgba(212,175,55,0.16)] bg-[#121212]/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link href="/employees" className="flex items-center gap-2">
            <Image
              src="/sandai-logo.png"
              alt="SANDAI"
              width={34}
              height={34}
              className="rounded-lg object-contain"
            />
            <span className="type-card-title tracking-[0.06em] text-[#f0d78c]">SANDAI</span>
          </Link>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`type-nav rounded-full px-3 py-1.5 whitespace-nowrap ${
                    active
                      ? "bg-[rgba(212,175,55,0.16)] text-[#f0d78c]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <LogoutButton compact />
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
