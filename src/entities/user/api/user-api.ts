import { apiClient } from "@/shared/api/base-api";
import { type User } from "../model/types";

export async function loginApi(
  email: string,
  password: string,
): Promise<User> {
  const result = await apiClient<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function signupApi(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  const result = await apiClient<User>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const result = await apiClient<User>("/api/auth/me");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
