"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { SignupForm } from "@/features/auth/ui/signup-form";

export function SignupPage(): ReactElement {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-16">
      <SignupForm onSuccess={() => router.push("/")} />
      <p className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-black underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
