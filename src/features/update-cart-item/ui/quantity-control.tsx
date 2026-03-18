"use client";

import { type ReactElement } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface QuantityControlProps {
  productId: string;
  quantity: number;
}

export function QuantityControl({
  productId,
  quantity,
}: QuantityControlProps): ReactElement {
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span className="w-8 text-center">{quantity}</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => updateQuantity(productId, quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
