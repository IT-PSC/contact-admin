import { CompanySettingsForm } from "@/components/CompanySettingsForm";
import { PageHeader } from "@/components/PageHeader";
import { getCompany } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const company = await getCompany();

  return (
    <div>
      <PageHeader
        eyebrow="Brand"
        title="Company settings"
        description="Set the company logo, name, and slogan used on every digital namecard."
      />
      <CompanySettingsForm company={company} />
    </div>
  );
}
