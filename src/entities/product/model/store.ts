import { create } from "zustand";
import { type Product } from "./types";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getProductById: (id) => get().products.find((p) => p.id === id),
}));
