export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface animate-rise flex flex-col items-start gap-4 px-8 py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(212,175,55,0.28)] bg-[var(--accent-soft)] text-[#d4af37]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <h3 className="type-section">{title}</h3>
        <p className="type-body mt-2 max-w-md text-[var(--muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
