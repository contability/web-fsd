"use client";

import { type ReactElement, useState } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps): ReactElement {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (): void => {
    addItem(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button onClick={handleClick} disabled={stock === 0}>
      {stock === 0
        ? "품절"
        : added
          ? "담았습니다!"
          : "장바구니에 담기"}
    </Button>
  );
}
