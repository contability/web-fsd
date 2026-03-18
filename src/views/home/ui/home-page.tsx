"use client";

import { type ReactElement, useEffect } from "react";
import { useProductStore, fetchProducts } from "@/entities/product";
import { ProductCard } from "@/widgets/product-card";

export function HomePage(): ReactElement {
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
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-4xl font-bold">FSD Shop</h1>
        <p className="text-lg text-gray-600">
          Feature-Sliced Design 아키텍처 샘플 프로젝트
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">추천 상품</h2>
        {isLoading && <p className="text-gray-500">로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
