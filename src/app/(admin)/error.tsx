"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const isBackend =
    /backend|502|503|504|fetch failed|ECONNREFUSED/i.test(error.message);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
        SANDAI
      </p>
      <h1 className="mt-3 text-2xl font-bold text-white">
        {isBackend ? t.error.backendTitle : t.error.genericTitle}
      </h1>
      <p className="mt-3 text-sm text-white/60">
        {isBackend
          ? t.error.backendDesc
          : error.message || t.error.unexpected}
      </p>
      <button type="button" className="btn btn-primary mt-8" onClick={reset}>
        {t.common.tryAgain}
      </button>
    </div>
  );
}
