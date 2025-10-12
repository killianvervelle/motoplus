"use client";

import ShowTags from '@/components/product/ShowTags'
import RangeSlider from '@/components/rangeSlider/RangeSlider'
import { ShopifyCollection } from '@/lib/shopify/types'
import { createUrl } from '@/lib/utils'
//import { slugify } from '@/lib/utils/textConverter'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { translateClient } from "../../lib/utils/translateClient";

function normalize(name: string) {
  return name.toLowerCase().trim();
}

const ProductFilters = ({
  categories,
  vendors,
  tags,
  maxPriceData,
  vendorsWithCounts,
  categoriesWithCounts
}: {
  categories: ShopifyCollection[]
  vendors: { vendor: string; productCount: number }[]
  tags: string[]
  maxPriceData: { amount: string; currencyCode: string }
  vendorsWithCounts: { vendor: string; productCount: number }[]
  categoriesWithCounts: { category: string; productCount: number }[]
}) => {

  const disableVendorClick = vendorsWithCounts.length < 2;
  const disableCatClick = categoriesWithCounts.length < 2;

  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedBrand = searchParams.get('v')
  const selectedCategory = searchParams.get('c')

  const onlyVendorFilterActive =
    searchParams.has("v") &&
    !searchParams.has("c") &&
    !searchParams.has("minPrice") &&
    !searchParams.has("maxPrice") &&
    !searchParams.has("q") &&
    !searchParams.has("t");

  const handleBrandClick = (name: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (name === selectedBrand) newParams.delete("v");
    else newParams.set("v", name);
    router.push(createUrl("/products", newParams), { scroll: false });
  };

  const handleCategoryClick = (handle: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (handle === selectedCategory) newParams.delete("c");
    else newParams.set("c", handle);
    router.push(createUrl("/products", newParams), { scroll: false });
  };

  const priceRange = translateClient("product-filters", "price-range");
  const cat = translateClient("product-filters", "product-cat");
  const brands = translateClient("product-filters", "brands");
  const tag = translateClient("product-filters", "tags");

  return (
    <div>
      <div>
        <h5 className='mb-2 lg:text-xl'>{priceRange}</h5>
        <hr className='border-[#cecece] dark:border-darkmode-border' />
        <div className='pt-4'>
          <Suspense>
            <RangeSlider maxPriceData={maxPriceData} />
          </Suspense>
        </div>
      </div>

      <div>
        <h5 className="mb-2 mt-4 lg:mt-6 lg:text-xl">{cat}</h5>
        <hr className="border-[#cecece] dark:border-darkmode-border" />
        <ul className="mt-4 space-y-4">
          {categories
            .filter(
              (c) => {
                const title = c.title.toLowerCase();
                const hiddenTitles = [
                  "all products",        
                  "tous les produits",   
                  "todos os produtos"   
                ];
                return (
                  !hiddenTitles.includes(title) &&
                  categoriesWithCounts.some(
                    (cw) => cw.category === c.title && cw.productCount > 0
                  )
                );
              }
            )
            .map(cat => {
              const currentCount =
                categoriesWithCounts.find(c => normalize(c.category) === normalize(cat.title))?.productCount ?? 0

              return (
                <li
                  key={cat.handle}
                  className={`flex items-center justify-between ${disableCatClick ? "" : "cursor-pointer"} ${selectedCategory === cat.handle
                    ? 'text-text-dark dark:text-darkmode-text-dark font-semibold'
                    : 'text-text-light dark:text-darkmode-text-light'
                    }`}
                  onClick={() => !disableCatClick && handleCategoryClick(cat.handle)}
                >
                  <span>
                    {cat.title} ({currentCount})
                  </span>
                </li>
              )
            })}
        </ul>
      </div>

      {vendors && (
        <div>
          <h5 className="mb-2 mt-8 lg:mt-10 lg:text-xl">{brands}</h5>
          <hr className="border-[#cecece] dark:border-darkmode-border" />
          <ul className="mt-4 space-y-4">
            {vendors
              .filter((v) => vendorsWithCounts.some(
                vw => vw.vendor === v.vendor && vw.productCount > 0
              )
              )
              .map((vendor) => {
                const dynamicCount =
                  vendorsWithCounts.find((v) => v.vendor === vendor.vendor)
                    ?.productCount ?? "vendor.productCount";

                const displayCount = onlyVendorFilterActive
                  ? vendor.productCount
                  : dynamicCount;

                return (
                  <li
                    key={vendor.vendor}
                    className={`flex items-center justify-between ${disableVendorClick ? "" : "cursor-pointer"} ${selectedBrand?.toLowerCase() === vendor.vendor.toLowerCase()
                      ? "text-text-dark dark:text-darkmode-text-dark font-semibold"
                      : "text-text-light dark:text-darkmode-text-light"
                      }`}
                    onClick={() =>
                      !disableVendorClick && handleBrandClick(vendor.vendor)}
                  >
                    <span>
                      {vendor.vendor} ({displayCount})
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h5 className='mb-2 mt-8 lg:mt-10 lg:text-xl'>{tag}</h5>
          <hr className='border-[#cecece] dark:border-darkmode-border' />
          <div className='mt-4'>
            <Suspense>
              {' '}
              <ShowTags tags={tags} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilters
