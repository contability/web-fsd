"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { LoginForm } from "@/features/auth/ui/login-form";

export function LoginPage(): ReactElement {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-16">
      <LoginForm onSuccess={() => router.push("/")} />
      <p className="mt-4 text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-black underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
