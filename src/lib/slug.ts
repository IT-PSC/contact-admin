export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(base: string, existing: string[], currentId?: string): string {
  const root = slugify(base) || "employee";
  let candidate = root;
  let i = 2;
  while (
    existing.some((item) => {
      // existing entries are "id:slug"
      const [id, slug] = item.split("::");
      return slug === candidate && id !== currentId;
    })
  ) {
    candidate = `${root}-${i}`;
    i += 1;
  }
  return candidate;
}
