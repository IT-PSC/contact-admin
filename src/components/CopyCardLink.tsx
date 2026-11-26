"use client";

import { useState } from "react";
import { cardUrl } from "@/lib/client-api";

export function CopyCardLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const url = cardUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this card link:", url);
    }
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={onCopy}>
      {copied ? "Copied!" : "Copy card link"}
    </button>
  );
}
