import { useUserStore } from "@/entities/user/model/store";
import { loginApi, signupApi } from "@/entities/user/api/user-api";
import { useState } from "react";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginApi(email, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signupApi(email, password, name);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearUser();
  };

  return { isLoading, error, login, signup, logout };
}
