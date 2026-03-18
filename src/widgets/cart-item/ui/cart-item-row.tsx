"use client";

import Image from "next/image";
import { type ReactElement } from "react";
import { type CartItem } from "@/entities/cart";
import { useProductStore } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { QuantityControl, RemoveItemButton } from "@/features/update-cart-item";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps): ReactElement {
  const product = useProductStore((s) => s.getProductById(item.productId));

  if (!product) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
        <p className="text-gray-500">상품 정보를 불러올 수 없습니다.</p>
        <RemoveItemButton productId={item.productId} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">
          {formatPrice(product.price)}
        </p>
      </div>
      <QuantityControl productId={item.productId} quantity={item.quantity} />
      <p className="w-24 text-right font-bold">
        {formatPrice(product.price * item.quantity)}
      </p>
      <RemoveItemButton productId={item.productId} />
    </div>
  );
}
