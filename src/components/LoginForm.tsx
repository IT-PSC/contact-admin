"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [email, setEmail] = useState("admin@sandai.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.login.loginFailed);

      const next = searchParams.get("next") || "/employees";
      router.replace(next.startsWith("/") ? next : "/employees");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.28)] bg-[linear-gradient(165deg,#050505_0%,#141414_55%,#0a0a0a_100%)] p-7 text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-9">
        <LanguageToggle variant="login" />

        <div className="mb-8 text-center">
          <Image
            src="/sandai-logo.png"
            alt="SANDAI"
            width={72}
            height={72}
            className="mx-auto h-[72px] w-[72px] object-contain"
            priority
          />
          <p className="mt-3 text-[12px] font-bold tracking-[0.28em] text-[#F0D78C]">
            SANDAI
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{t.login.title}</h1>
          <p className="mt-2 text-sm text-white/55">{t.login.subtitle}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-[#D4AF37]">
              {t.login.email}
            </span>
            <input
              className="field w-full"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-[#D4AF37]">
              {t.login.password}
            </span>
            <input
              className="field w-full"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary mt-2 w-full justify-center"
            disabled={loading}
          >
            {loading ? t.login.signingIn : t.login.signIn}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-white/40">{t.login.defaultHint}</p>
      </div>
    </main>
  );
}
