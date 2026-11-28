import { DepartmentsPageClient } from "@/components/DepartmentsPageClient";
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
    <DepartmentsPageClient
      departments={departments}
      employeeCounts={employeeCounts}
    />
  );
}
