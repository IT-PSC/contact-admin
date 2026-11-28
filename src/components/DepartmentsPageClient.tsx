"use client";

import type { Department } from "@/lib/types";
import { DepartmentManager } from "./DepartmentManager";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function DepartmentsPageClient({
  departments,
  employeeCounts,
}: {
  departments: Department[];
  employeeCounts: Record<string, number>;
}) {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader
        eyebrow={t.departments.eyebrow}
        title={t.departments.title}
        description={t.departments.description}
      />
      <DepartmentManager departments={departments} employeeCounts={employeeCounts} />
    </div>
  );
}
