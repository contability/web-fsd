import { API_BASE_URL } from "@/shared/config";

type ApiSuccess<T> = { data: T; success: true };
type ApiError = { error: string; success: false };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  const { headers: customHeaders, ...restOptions } = options ?? {};
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: `Request failed with status ${response.status}`,
    };
  }

  const data: T = await response.json();
  return { data, success: true };
}
