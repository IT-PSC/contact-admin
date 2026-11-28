import { redirect } from "next/navigation";
import { ProfilePageClient } from "@/components/ProfilePageClient";
import { getCurrentAdmin } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return <ProfilePageClient admin={admin} />;
}
