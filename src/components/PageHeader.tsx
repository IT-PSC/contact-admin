export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="animate-rise mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="type-helper mb-2 font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="type-page-title text-[var(--text)]">{title}</h1>
        {description ? (
          <p className="type-body mt-2 max-w-xl text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
