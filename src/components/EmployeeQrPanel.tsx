"use client";

import { CardQrCode } from "./CardQrCode";

export function EmployeeQrPanel({ slug, name }: { slug: string; name: string }) {
  return (
    <section className="surface animate-rise p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#D4AF37]">
        PRINT / SHARE
      </p>
      <h2 className="type-section mt-2">QR code</h2>
      <p className="type-helper mt-1 text-[var(--muted)]">
        Put this QR on a printed card. Scanning opens the digital namecard
        (/card/…/digital).
      </p>
      <div className="mt-5">
        <CardQrCode slug={slug} name={name} size={168} />
      </div>
    </section>
  );
}
