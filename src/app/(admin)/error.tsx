"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        {isBackend ? "Backend unavailable" : "Something went wrong"}
      </h1>
      <p className="mt-3 text-sm text-white/60">
        {isBackend
          ? "The API did not respond (often a sleeping or crashed Render free-tier service). Open the backend URL /api/health, wait for it to wake, then try again."
          : error.message || "An unexpected error occurred."}
      </p>
      <button type="button" className="btn btn-primary mt-8" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
