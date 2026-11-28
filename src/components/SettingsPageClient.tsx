"use client";

import type { CompanySettings } from "@/lib/types";
import { CompanySettingsForm } from "./CompanySettingsForm";
import { useLocale } from "./LocaleProvider";
import { PageHeader } from "./PageHeader";

export function SettingsPageClient({ company }: { company: CompanySettings }) {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader
        eyebrow={t.company.eyebrow}
        title={t.company.title}
        description={t.company.description}
      />
      <CompanySettingsForm company={company} />
    </div>
  );
}
