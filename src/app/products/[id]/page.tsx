import { type ReactElement } from "react";
import { ProductDetailPage } from "@/views/product-detail/ui/product-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}
