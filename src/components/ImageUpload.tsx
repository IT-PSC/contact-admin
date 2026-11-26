"use client";

import { mediaUrl } from "@/lib/client-api";

type Props = {
  label: string;
  hint?: string;
  value: string;
  uploading: boolean;
  onUpload: (file: File | null) => void;
  onClear: () => void;
  previewShape?: "rounded" | "circle";
};

export function ImageUpload({
  label,
  hint = "PNG or JPG, up to 2MB.",
  value,
  uploading,
  onUpload,
  onClear,
  previewShape = "rounded",
}: Props) {
  const shapeClass = previewShape === "circle" ? "rounded-full" : "rounded-2xl";
  const preview = mediaUrl(value);

  return (
    <div className="space-y-3">
      <div>
        <p className="type-label">{label}</p>
        <p className="type-helper mt-1 text-[var(--muted)]">{hint}</p>
      </div>

      {preview ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={label}
            className={`h-20 w-20 object-cover shadow-[0_8px_24px_rgba(12,20,18,0.12)] ${shapeClass}`}
          />
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Remove
          </button>
        </div>
      ) : null}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(212,175,55,0.28)] bg-black/25 px-4 py-7 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
        <span className="type-label text-[var(--accent-strong)]">
          {uploading ? "Uploading..." : value ? "Replace image" : "Choose image"}
        </span>
        <span className="type-helper mt-1 text-[var(--muted)]">Click to browse</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
