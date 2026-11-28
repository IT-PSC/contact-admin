"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cardUrl } from "@/lib/client-api";
import { resolveEmployeeContacts } from "@/lib/contacts";
import type { Department, Employee } from "@/lib/types";
import { Avatar } from "./Avatar";
import { CardQrModal } from "./CardQrCode";
import { CopyCardLink } from "./CopyCardLink";
import { EmptyState } from "./EmptyState";
import { FancySelect } from "./FancySelect";
import { useLocale } from "./LocaleProvider";

type Props = {
  employees: Employee[];
  departments: Department[];
};

export function EmployeeList({ employees, departments }: Props) {
  const router = useRouter();
  const { t, format } = useLocale();
  const [query, setQuery] = useState("");
  const [departmentId, setDepartmentId] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);

  const departmentMap = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesDept =
        departmentId === "all" || employee.departmentId === departmentId;
      if (!matchesDept) return false;
      if (!q) return true;
      return [
        employee.name,
        employee.bio,
        employee.position,
        employee.email,
        employee.phone,
        employee.telegram,
        employee.facebook,
        employee.tiktok,
        employee.linkedin,
        ...employee.spokenLanguages,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [employees, query, departmentId]);

  async function onDelete(id: string) {
    if (!confirm(t.employees.deleteConfirm)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.common.deleteFailed);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : t.common.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  }

  function socialCount(employee: Employee) {
    return resolveEmployeeContacts(employee).length;
  }

  return (
    <div className="space-y-4">
      <div className="relative z-20 flex flex-col gap-3 border-b border-[rgba(212,175,55,0.14)] pb-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            className="field field-with-icon"
            placeholder={t.employees.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <FancySelect
          className="md:max-w-[240px] md:min-w-[200px]"
          aria-label={t.employees.allDepartments}
          value={departmentId}
          onChange={setDepartmentId}
          options={[
            { value: "all", label: t.employees.allDepartments },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={employees.length === 0 ? t.employees.noEmployees : t.employees.noMatches}
          description={
            employees.length === 0
              ? t.employees.noEmployeesDesc
              : t.employees.noMatchesDesc
          }
          action={
            employees.length === 0 ? (
              <Link href="/employees/new" className="btn btn-primary">
                {t.employees.add}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="stagger">
          {filtered.map((employee) => (
            <article
              key={employee.id}
              className="group grid gap-4 border-b border-[rgba(212,175,55,0.12)] py-5 transition duration-200 last:border-b-0 hover:bg-[rgba(212,175,55,0.03)] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6"
            >
              <Avatar name={employee.name} logoUrl={employee.photoUrl} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="type-card-title truncate text-white">
                    {employee.name}
                  </h2>
                  <span className="badge">
                    {departmentMap[employee.departmentId] || t.employees.unassigned}
                  </span>
                </div>
                <p className="type-body mt-1.5 line-clamp-2 text-[var(--muted)]">
                  {employee.bio || employee.position}
                </p>
                <div className="type-helper mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted)]">
                  <span className="text-white/70">{employee.position}</span>
                  {employee.spokenLanguages.length > 0 ? (
                    <>
                      <span className="text-[rgba(212,175,55,0.35)]" aria-hidden>
                        ·
                      </span>
                      <span>
                        {employee.spokenLanguages.length === 1
                          ? t.employees.speaksOne
                          : format(t.employees.speaksMany, {
                              count: employee.spokenLanguages.length,
                            })}
                      </span>
                    </>
                  ) : null}
                  <span className="text-[rgba(212,175,55,0.35)]" aria-hidden>
                    ·
                  </span>
                  <a className="hover:text-[var(--accent)]" href={`mailto:${employee.email}`}>
                    {employee.email}
                  </a>
                  {employee.phone ? (
                    <>
                      <span className="text-[rgba(212,175,55,0.35)]" aria-hidden>
                        ·
                      </span>
                      <span>{employee.phone}</span>
                    </>
                  ) : null}
                  <span className="text-[rgba(212,175,55,0.35)]" aria-hidden>
                    ·
                  </span>
                  <span>
                    {format(t.employees.contactLinks, {
                      count: socialCount(employee),
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <a
                  href={cardUrl(employee.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  {t.common.viewCard}
                </a>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setQrEmployee(employee)}
                  >
                    {t.employees.qrCode}
                  </button>
                  <CopyCardLink slug={employee.slug} />
                  <Link href={`/employees/${employee.id}/edit`} className="btn btn-ghost">
                    {t.common.edit}
                  </Link>
                  <button
                    className="btn btn-danger"
                    type="button"
                    disabled={deletingId === employee.id}
                    onClick={() => onDelete(employee.id)}
                  >
                    {deletingId === employee.id ? t.common.deleting : t.common.delete}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <CardQrModal
        open={Boolean(qrEmployee)}
        slug={qrEmployee?.slug || ""}
        name={qrEmployee?.name || ""}
        onClose={() => setQrEmployee(null)}
      />
    </div>
  );
}
