import { notFound } from "next/navigation";
import { EditEmployeePageClient } from "@/components/EditEmployeePageClient";
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
    <EditEmployeePageClient
      employee={employee}
      departments={departments}
      languages={languages}
      webBase={webBase}
    />
  );
}
