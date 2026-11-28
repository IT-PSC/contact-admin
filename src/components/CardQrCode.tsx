"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { digitalCardUrl } from "@/lib/client-api";
import { useLocale } from "./LocaleProvider";

type Props = {
  slug: string;
  name: string;
  size?: number;
  showActions?: boolean;
};

export function CardQrCode({ slug, name, size = 180, showActions = true }: Props) {
  const { t, format } = useLocale();
  const url = digitalCardUrl(slug);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function downloadPng() {
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${slug}-qr.png`;
    link.click();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt(t.common.copyThisCardLink, url);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={canvasWrapRef}
        className="rounded-2xl border border-[rgba(212,175,55,0.35)] bg-white p-3 shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
      >
        <QRCodeCanvas
          value={url}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#050505"
        />
      </div>
      <p className="max-w-[220px] text-center text-[12px] text-[var(--muted)]">
        {format(t.qr.scanToOpen, { name })}
      </p>
      <p className="max-w-[240px] truncate text-center text-[11px] text-[#D4AF37]/80">
        {url}
      </p>
      {showActions ? (
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-primary" onClick={downloadPng}>
            {t.qr.downloadQr}
          </button>
          <button type="button" className="btn btn-ghost" onClick={copyLink}>
            {copied ? t.common.copied : t.common.copyLink}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type ModalProps = {
  slug: string;
  name: string;
  open: boolean;
  onClose: () => void;
};

export function CardQrModal({ slug, name, open, onClose }: ModalProps) {
  const { t, format } = useLocale();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={format(t.qr.qrFor, { name })}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[24px] border border-[rgba(212,175,55,0.28)] bg-[#121212] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#D4AF37]">
              {t.qr.qrCode}
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">{name}</h3>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t.common.close}
          </button>
        </div>
        <CardQrCode slug={slug} name={name} size={200} />
      </div>
    </div>
  );
}
