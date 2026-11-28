import { NewEmployeePageClient } from "@/components/NewEmployeePageClient";
import { listDepartments, listLanguages } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function NewEmployeePage() {
  const [departments, languages] = await Promise.all([
    listDepartments(),
    listLanguages(),
  ]);

  return (
    <NewEmployeePageClient departments={departments} languages={languages} />
  );
}
