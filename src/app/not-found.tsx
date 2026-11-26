import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="max-w-md rounded-[24px] border border-[rgba(212,175,55,0.25)] bg-[#121212] p-8 text-center text-white">
        <p className="text-sm font-medium tracking-[0.16em] text-[#D4AF37]">SANDAI</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-white/60">
          The page you requested does not exist.
        </p>
        <Link href="/employees" className="btn btn-primary mt-6 inline-flex">
          Back to admin
        </Link>
      </div>
    </div>
  );
}
