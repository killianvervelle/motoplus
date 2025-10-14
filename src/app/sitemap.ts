import { getProducts, getCollections } from "@/lib/shopify"

export async function getAllProducts(locale?: string) {
  const allProducts: any[] = [];
  let cursor: string | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const { pageInfo, products } = await getProducts({
      cursor,
      locale,
      sortKey: "CREATED_AT",
      reverse: true,
    });

    allProducts.push(...products);

    hasNextPage = pageInfo?.hasNextPage;
    cursor = pageInfo?.endCursor || undefined;

    // Safety: avoid infinite loops if API fails
    if (!cursor) break;
  }

  return allProducts;
}

export const revalidate = 60 //* 60 * 24 * 7

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || ""

  // Static pages
  const staticPages = [
    { url: `${siteUrl}/`, priority: 1.0 },
    { url: `${siteUrl}/products`, priority: 0.9 },
    { url: `${siteUrl}/about`, priority: 0.6 },
    { url: `${siteUrl}/contact`, priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, priority: 0.3 },
    { url: `${siteUrl}/terms-service`, priority: 0.3 },
    { url: `${siteUrl}/cookies-policy`, priority: 0.3 },
  ]

  // Dynamic collections / categories
  const collections = await getCollections("en")
  const collectionUrls = collections.map((c) => ({
    url: `${siteUrl}/collections/${c.handle}`,
    lastModified: c.updatedAt || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Dynamic product pages
  const products = await getAllProducts()
  const productUrls = products.map((p) => ({
    url: `${siteUrl}/products/${p.handle}`,
    lastModified: p.updatedAt || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  // Optional brand/vendor pages
  const vendors = [...new Set(products.map((p) => p.vendor))]
  const vendorUrls = vendors.map((v) => ({
    url: `${siteUrl}/brands/${encodeURIComponent(v)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticPages, ...collectionUrls, ...productUrls, ...vendorUrls]
}
