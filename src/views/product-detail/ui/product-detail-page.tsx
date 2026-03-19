"use client";

import Image from "next/image";
import { type ReactElement, useEffect } from "react";
import { useProductStore } from "@/entities/product/model/store";
import { fetchProductById } from "@/entities/product/api/product-api";
import { ProductInfo } from "@/entities/product/ui/product-info";
import { AddToCartButton } from "@/features/add-to-cart/ui/add-to-cart-button";

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({
  productId,
}: ProductDetailPageProps): ReactElement {
  const product = useProductStore((s) => s.getProductById(productId));
  const isLoading = useProductStore((s) => s.isLoading);
  const error = useProductStore((s) => s.error);
  const setProducts = useProductStore((s) => s.setProducts);
  const setLoading = useProductStore((s) => s.setLoading);
  const setError = useProductStore((s) => s.setError);

  useEffect(() => {
    if (product) return;
    setLoading(true);
    fetchProductById(productId)
      .then((fetched) => {
        const current = useProductStore.getState().products;
        setProducts([...current, fetched]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [product, productId, setProducts, setLoading, setError]);

  if (isLoading) {
    return <p className="text-gray-500">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-gray-500">상품을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex flex-col gap-6">
        <ProductInfo product={product} />
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </div>
  );
}
