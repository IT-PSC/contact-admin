"use client";

import Link from "next/link";
import type { Department, Employee, Language } from "@/lib/types";
import { CopyCardLink } from "./CopyCardLink";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeQrPanel } from "./EmployeeQrPanel";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function EditEmployeePageClient({
  employee,
  departments,
  languages,
  webBase,
}: {
  employee: Employee;
  departments: Department[];
  languages: Language[];
  webBase: string;
}) {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader
        eyebrow={t.employees.editEyebrow}
        title={employee.name}
        description={t.employees.editDescription}
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href={`${webBase}/card/${employee.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              {t.common.viewCard}
            </a>
            <CopyCardLink slug={employee.slug} />
            <Link href="/employees" className="btn btn-ghost">
              {t.common.backToList}
            </Link>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
        <EmployeeForm
          departments={departments}
          languages={languages}
          employee={employee}
        />
        <EmployeeQrPanel slug={employee.slug} name={employee.name} />
      </div>
    </div>
  );
}
