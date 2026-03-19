"use client";

import { type ReactElement, useEffect } from "react";
import { useProductStore } from "@/entities/product/model/store";
import { fetchProducts } from "@/entities/product/api/product-api";
import { ProductCard } from "@/widgets/product-card/ui/product-card";

export function ProductListPage(): ReactElement {
  const { products, isLoading, error, setProducts, setLoading, setError } =
    useProductStore();

  useEffect(() => {
    if (products.length > 0) return;
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [products.length, setProducts, setLoading, setError]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">전체 상품</h1>
      {isLoading && <p className="text-gray-500">로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
