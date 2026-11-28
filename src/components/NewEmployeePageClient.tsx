"use client";

import Link from "next/link";
import type { Department, Language } from "@/lib/types";
import { EmployeeForm } from "./EmployeeForm";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function NewEmployeePageClient({
  departments,
  languages,
}: {
  departments: Department[];
  languages: Language[];
}) {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader
        eyebrow={t.employees.newEyebrow}
        title={t.employees.newTitle}
        description={t.employees.newDescription}
        action={
          <Link href="/employees" className="btn btn-ghost">
            {t.common.backToList}
          </Link>
        }
      />
      {departments.length === 0 ? (
        <div className="surface p-8">
          <h2 className="type-section">{t.employees.needDeptTitle}</h2>
          <p className="type-body mt-2 text-[var(--muted)]">
            {t.employees.needDeptDesc}
          </p>
          <Link href="/departments" className="btn btn-primary mt-5">
            {t.employees.manageDepartments}
          </Link>
        </div>
      ) : (
        <EmployeeForm departments={departments} languages={languages} />
      )}
    </div>
  );
}
