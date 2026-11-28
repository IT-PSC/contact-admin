import { EmployeesPageClient } from "@/components/EmployeesPageClient";
import { listDepartments, listEmployees } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const [employees, departments] = await Promise.all([
    listEmployees(),
    listDepartments(),
  ]);

  return <EmployeesPageClient employees={employees} departments={departments} />;
}
