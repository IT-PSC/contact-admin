"use client";

import { useLocale } from "./LocaleProvider";

export function LoginLoading() {
  const { t } = useLocale();
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <p className="text-white/60">{t.common.loading}</p>
    </main>
  );
}
