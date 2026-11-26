import { DepartmentManager } from "@/components/DepartmentManager";
import { PageHeader } from "@/components/PageHeader";
import { listDepartments, listEmployees } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const [departments, employees] = await Promise.all([
    listDepartments(),
    listEmployees(),
  ]);

  const employeeCounts = employees.reduce<Record<string, number>>((acc, employee) => {
    acc[employee.departmentId] = (acc[employee.departmentId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        eyebrow="Organization"
        title="Departments"
        description="Define the teams people belong to. These show up in employee forms and filters."
      />
      <DepartmentManager departments={departments} employeeCounts={employeeCounts} />
    </div>
  );
}
