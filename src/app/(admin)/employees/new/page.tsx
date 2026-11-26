import Link from "next/link";
import { EmployeeForm } from "@/components/EmployeeForm";
import { PageHeader } from "@/components/PageHeader";
import { listDepartments, listLanguages } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function NewEmployeePage() {
  const [departments, languages] = await Promise.all([
    listDepartments(),
    listLanguages(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Create"
        title="New employee"
        description="Add photo, name, bio, position, department, email, and personal social contacts for the namecard."
        action={
          <Link href="/employees" className="btn btn-ghost">
            Back to list
          </Link>
        }
      />
      {departments.length === 0 ? (
        <div className="surface p-8">
          <h2 className="type-section">Add a department first</h2>
          <p className="type-body mt-2 text-[var(--muted)]">
            Employees need a department before you can save a profile.
          </p>
          <Link href="/departments" className="btn btn-primary mt-5">
            Manage departments
          </Link>
        </div>
      ) : (
        <EmployeeForm departments={departments} languages={languages} />
      )}
    </div>
  );
}
