"use client";

import Link from "next/link";
import type { Department, Employee } from "@/lib/types";
import { EmployeeList } from "./EmployeeList";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function EmployeesPageClient({
  employees,
  departments,
}: {
  employees: Employee[];
  departments: Department[];
}) {
  const { t } = useLocale();
  return (
    <div>
      <PageHeader
        eyebrow={t.employees.eyebrow}
        title={t.employees.title}
        description={t.employees.description}
        action={
          <Link href="/employees/new" className="btn btn-primary">
            {t.employees.add}
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="surface animate-rise px-5 py-4">
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            {t.employees.people}
          </p>
          <p className="type-kpi mt-2">{employees.length}</p>
        </div>
        <div className="surface animate-rise px-5 py-4" style={{ animationDelay: "0.06s" }}>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            {t.employees.departments}
          </p>
          <p className="type-kpi mt-2">{departments.length}</p>
        </div>
        <div className="surface animate-rise px-5 py-4" style={{ animationDelay: "0.12s" }}>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            {t.employees.withPhoto}
          </p>
          <p className="type-kpi mt-2">
            {employees.filter((e) => Boolean(e.photoUrl)).length}
          </p>
        </div>
      </div>

      <EmployeeList employees={employees} departments={departments} />
    </div>
  );
}
