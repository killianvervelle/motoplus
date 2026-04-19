'use client';

import { Product } from "@/lib/shopify/types";

export default function ProductSchema({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images.map((img) => img.url),
    "brand": {
      "@type": "Brand",
      "name": product.vendor
    },
    "offers": {
      "@type": "AggregateOffer",
      "availability": product.availableForSale 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceCurrency": "USD",
      "lowPrice": product.priceRange?.minVariantPrice.amount,
      "highPrice": product.priceRange?.maxVariantPrice.amount,
    },
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.handle}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}