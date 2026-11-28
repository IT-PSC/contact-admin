"use client";

import { LOCALES } from "@/lib/i18n/messages";
import { useLocale } from "./LocaleProvider";

export function LanguageToggle({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "header" | "login";
}) {
  const { locale, setLocale, t } = useLocale();

  if (variant === "header") {
    return (
      <div
        className="flex shrink-0 items-center gap-0.5 rounded-full border border-[rgba(212,175,55,0.22)] bg-black/30 p-0.5"
        role="group"
        aria-label={t.shell.language}
      >
        {LOCALES.map((item) => {
          const active = locale === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLocale(item.code)}
              className={`type-nav rounded-full px-2.5 py-1 transition ${
                active
                  ? "bg-[rgba(212,175,55,0.2)] text-[#f0d78c]"
                  : "text-white/50 hover:text-white/80"
              }`}
              aria-pressed={active}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "login") {
    return (
      <div className="mb-5 flex justify-end">
        <div
          className="flex items-center gap-0.5 rounded-full border border-[rgba(212,175,55,0.28)] bg-black/35 p-0.5"
          role="group"
          aria-label={t.shell.language}
        >
          {LOCALES.map((item) => {
            const active = locale === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLocale(item.code)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-wide transition ${
                  active
                    ? "bg-[rgba(212,175,55,0.22)] text-[#F0D78C]"
                    : "text-white/45 hover:text-white/75"
                }`}
                aria-pressed={active}
              >
                {item.short}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.16)] bg-black/30 p-3">
      <p className="type-helper mb-2 uppercase tracking-[0.18em] text-[#d4af37]/70">
        {t.shell.language}
      </p>
      <div
        className="grid grid-cols-2 gap-1.5"
        role="group"
        aria-label={t.shell.language}
      >
        {LOCALES.map((item) => {
          const active = locale === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLocale(item.code)}
              className={`rounded-xl px-3 py-2 text-[13px] font-medium transition ${
                active
                  ? "bg-[rgba(212,175,55,0.16)] text-[#f0d78c] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.28)]"
                  : "text-white/55 hover:bg-white/5 hover:text-white/80"
              }`}
              aria-pressed={active}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
