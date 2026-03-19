"use client";

import { type FormEvent, type ReactElement, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAuth } from "../model/use-auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps): ReactElement {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">로그인</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
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
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
