"use client";

import { type ReactElement } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface RemoveItemButtonProps {
  productId: string;
}

export function RemoveItemButton({
  productId,
}: RemoveItemButtonProps): ReactElement {
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Button variant="danger" size="sm" onClick={() => removeItem(productId)}>
      삭제
    </Button>
  );
}
