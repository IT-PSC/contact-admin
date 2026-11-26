import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function CardRedirectPage({ params }: Props) {
  const { slug } = await params;
  const webBase =
    process.env.CONTACT_WEB_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_CONTACT_WEB_URL?.replace(/\/$/, "") ||
    "http://localhost:3001";

  redirect(`${webBase}/card/${encodeURIComponent(slug)}`);
}
