import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <p className="text-white/60">Loading...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
