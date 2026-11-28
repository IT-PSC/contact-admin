import { SettingsPageClient } from "@/components/SettingsPageClient";
import { getCompany } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const company = await getCompany();
  return <SettingsPageClient company={company} />;
}
