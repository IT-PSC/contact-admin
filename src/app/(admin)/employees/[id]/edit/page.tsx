import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCardLink } from "@/components/CopyCardLink";
import { EmployeeForm } from "@/components/EmployeeForm";
import { EmployeeQrPanel } from "@/components/EmployeeQrPanel";
import { PageHeader } from "@/components/PageHeader";
import { getEmployee, listDepartments, listLanguages } from "@/lib/backend";

export const dynamic = "force-dynamic";

const webBase =
  process.env.NEXT_PUBLIC_CONTACT_WEB_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

type Props = { params: Promise<{ id: string }> };

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params;
  const [employee, departments, languages] = await Promise.all([
    getEmployee(id),
    listDepartments(),
    listLanguages(),
  ]);

  if (!employee) notFound();

  return (
    <div>
      <PageHeader
        eyebrow="Edit"
        title={employee.name}
        description="Update profile details and logo for this contact."
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href={`${webBase}/card/${employee.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              View card
            </a>
            <CopyCardLink slug={employee.slug} />
            <Link href="/employees" className="btn btn-ghost">
              Back to list
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
