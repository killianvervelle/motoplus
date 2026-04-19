'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface NodeItem {
  title: string;
}

interface ProductBreadcrumbsProps {
  productTitle: string;
  collections: { nodes: NodeItem[] };
  locale: string;
  className?: string;
}

export default function Breadcrumbs({
  productTitle,
  collections,
  locale,
  className = '',
}: ProductBreadcrumbsProps) {
  // Get primary category from collections
  const category = collections.nodes[0]?.title || 'Products';
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/products?c=${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productTitle,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/products/${productTitle}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`bg-gray-50 dark:bg-darkmode-light py-4 ${className}`}
      >
        <div className="container">
          <ol className="flex flex-wrap gap-2 text-sm">
            <li>
              <Link
                href={`/${locale}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <Link
                href={`/${locale}/products`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Products
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <Link
                href={`/${locale}/products?c=${categorySlug}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {category}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li aria-current="page" className="text-gray-500 dark:text-gray-400">
              {productTitle}
            </li>
          </ol>
        </div>
      </nav>
    </>
  );
}