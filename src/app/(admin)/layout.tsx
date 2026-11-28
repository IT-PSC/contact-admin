import type { Metadata } from "next";
import { AdminShell } from "@/components/AdminShell";
import { getCurrentAdmin } from "@/lib/backend";

export const metadata: Metadata = {
  title: "SANDAI — Contact Admin",
  description: "SANDAI admin portal for employee digital namecards",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getCurrentAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
