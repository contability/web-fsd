"use client";

import { type FormEvent, type ReactElement, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAuth } from "../model/use-auth";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps): ReactElement {
  const { signup, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      onSuccess?.();
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">회원가입</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input
        label="이름"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
