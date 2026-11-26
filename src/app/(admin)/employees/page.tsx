import Link from "next/link";
import { EmployeeList } from "@/components/EmployeeList";
import { PageHeader } from "@/components/PageHeader";
import { listDepartments, listEmployees } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const [employees, departments] = await Promise.all([
    listEmployees(),
    listDepartments(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Employees"
        description="Manage digital namecard profiles: photo, bio, position, department, email, and personal contacts."
        action={
          <Link href="/employees/new" className="btn btn-primary">
            Add employee
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="surface animate-rise px-5 py-4">
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            People
          </p>
          <p className="type-kpi mt-2">{employees.length}</p>
        </div>
        <div className="surface animate-rise px-5 py-4" style={{ animationDelay: "0.06s" }}>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Departments
          </p>
          <p className="type-kpi mt-2">{departments.length}</p>
        </div>
        <div className="surface animate-rise px-5 py-4" style={{ animationDelay: "0.12s" }}>
          <p className="type-helper font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            With photo
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
