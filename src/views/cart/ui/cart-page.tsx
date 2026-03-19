"use client";

import Link from "next/link";
import { type ReactElement, useEffect } from "react";
import { useCartStore } from "@/entities/cart/model/store";
import { useProductStore } from "@/entities/product/model/store";
import { fetchProducts } from "@/entities/product/api/product-api";
import { formatPrice } from "@/shared/lib/format-price";
import { Button } from "@/shared/ui/button";
import { CartItemRow } from "@/widgets/cart-item/ui/cart-item-row";

export function CartPage(): ReactElement {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { products, setProducts, setLoading } = useProductStore();

  useEffect(() => {
    if (products.length > 0) return;
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [products.length, setProducts, setLoading]);

  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg text-gray-500">장바구니가 비어있습니다.</p>
        <Link href="/products">
          <Button variant="secondary">쇼핑 계속하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">장바구니</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <Button variant="secondary" onClick={clearCart}>
          장바구니 비우기
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">
            총 {formatPrice(totalPrice)}
          </span>
          <Button>주문하기</Button>
        </div>
      </div>
    </div>
  );
}
