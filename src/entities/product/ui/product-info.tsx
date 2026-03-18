import { type ReactElement } from "react";
import { formatPrice } from "@/shared/lib/format-price";
import { type Product } from "../model/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-xl font-semibold">{formatPrice(product.price)}</p>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          {product.category}
        </span>
        <span className="text-sm text-gray-500">
          재고 {product.stock}개
        </span>
      </div>
    </div>
  );
}
