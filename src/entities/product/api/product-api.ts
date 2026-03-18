import { apiClient } from "@/shared/api/base-api";
import { type Product } from "../model/types";

export async function fetchProducts(): Promise<Product[]> {
  const result = await apiClient<Product[]>("/api/products");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const result = await apiClient<Product>(`/api/products/${id}`);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
