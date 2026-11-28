"use client";

import { CardQrCode } from "./CardQrCode";
import { useLocale } from "./LocaleProvider";

export function EmployeeQrPanel({ slug, name }: { slug: string; name: string }) {
  const { t } = useLocale();

  return (
    <section className="surface animate-rise p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#D4AF37]">
        {t.qr.qrCode}
      </p>
      <h2 className="type-section mt-2">{t.employees.qrCode}</h2>
      <p className="type-helper mt-1 text-[var(--muted)]">{t.qr.panelHint}</p>
      <div className="mt-5">
        <CardQrCode slug={slug} name={name} size={168} />
      </div>
    </section>
  );
}
