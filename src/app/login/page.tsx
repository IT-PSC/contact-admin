import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { LoginLoading } from "@/components/LoginLoading";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
