import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { type Product } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { AddToCartButton } from "@/features/add-to-cart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): ReactElement {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-auto text-lg font-bold">{formatPrice(product.price)}</p>
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </div>
  );
}
