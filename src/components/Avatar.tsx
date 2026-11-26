import { mediaUrl } from "@/lib/client-api";

export function Avatar({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const sizeClass =
    size === "lg" ? "h-24 w-24 text-[24px]" : size === "sm" ? "h-10 w-10 text-[12px]" : "h-14 w-14 text-[14px]";

  const src = mediaUrl(logoUrl);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-2xl object-cover shadow-[0_8px_24px_rgba(12,20,18,0.12)]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#2a2a2a,#d4af37)] font-semibold text-black shadow-[0_8px_24px_rgba(212,175,55,0.28)]`}
    >
      {initials || "?"}
    </div>
  );
}
