"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={
        compact
          ? "type-nav rounded-full px-3 py-1.5 text-[var(--muted)] hover:text-[#f0d78c]"
          : "mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-[13px] font-medium text-white/70 transition hover:border-[#D4AF37]/40 hover:text-[#F0D78C]"
      }
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
