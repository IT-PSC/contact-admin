"use client";

import { useState } from "react";
import { cardUrl } from "@/lib/client-api";
import { useLocale } from "./LocaleProvider";

export function CopyCardLink({ slug }: { slug: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const url = cardUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t.common.copyThisCardLink, url);
    }
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={onCopy}>
      {copied ? t.common.copied : t.common.copyCardLink}
    </button>
  );
}
