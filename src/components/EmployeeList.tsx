"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cardUrl } from "@/lib/client-api";
import type { Department, Employee } from "@/lib/types";
import { Avatar } from "./Avatar";
import { CardQrModal } from "./CardQrCode";
import { CopyCardLink } from "./CopyCardLink";
import { EmptyState } from "./EmptyState";

type Props = {
  employees: Employee[];
  departments: Department[];
};

export function EmployeeList({ employees, departments }: Props) {
  const router = useRouter();
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
    if (!confirm("Delete this employee profile?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  function socialCount(employee: Employee) {
    return [employee.phone, employee.telegram, employee.facebook, employee.tiktok, employee.linkedin]
      .filter(Boolean).length;
  }

  return (
    <div className="space-y-5">
      <div className="surface animate-rise flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            className="field pl-11"
            placeholder="Search name, email, phone, social..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
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
        <select
          className="field md:max-w-[240px]"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={employees.length === 0 ? "No employees yet" : "No matches"}
          description={
            employees.length === 0
              ? "Create a namecard profile with photo, role, bio, and personal contacts."
              : "Try another search or clear the department filter."
          }
          action={
            employees.length === 0 ? (
              <Link href="/employees/new" className="btn btn-primary">
                Add employee
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="stagger grid gap-4">
          {filtered.map((employee) => (
            <article
              key={employee.id}
              className="surface group grid gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(12,20,18,0.12)] md:grid-cols-[auto_1fr_auto] md:items-center"
            >
              <Avatar name={employee.name} logoUrl={employee.photoUrl} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="type-card-title truncate">{employee.name}</h2>
                  <span className="badge">
                    {departmentMap[employee.departmentId] || "Unassigned"}
                  </span>
                </div>
                <p className="type-body mt-1 line-clamp-2 text-[var(--muted)]">
                  {employee.bio || employee.position}
                </p>
                <div className="type-body mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[var(--muted)]">
                  <span>{employee.position}</span>
                  {employee.spokenLanguages.length > 0 ? (
                    <span>
                      Speaks {employee.spokenLanguages.length} language
                      {employee.spokenLanguages.length === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  <a className="hover:text-[var(--accent)]" href={`mailto:${employee.email}`}>
                    {employee.email}
                  </a>
                  {employee.phone ? <span>{employee.phone}</span> : null}
                  <span>{socialCount(employee)} contact links</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <a
                  href={cardUrl(employee.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  View card
                </a>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setQrEmployee(employee)}
                >
                  QR code
                </button>
                <CopyCardLink slug={employee.slug} />
                <Link href={`/employees/${employee.id}/edit`} className="btn btn-ghost">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  type="button"
                  disabled={deletingId === employee.id}
                  onClick={() => onDelete(employee.id)}
                >
                  {deletingId === employee.id ? "Deleting..." : "Delete"}
                </button>
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
