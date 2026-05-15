'use client'

import { AddToCart } from '@/components/cart/AddToCart'
import SkeletonCards from '@/components/loadings/skeleton/SkeletonCards'
import ImageFallback from '@/helpers/ImageFallback'
import { defaultSort, sorting } from '@/lib/constants'
import { getCollectionProducts, getProducts } from '@/lib/shopify'
import { PageInfo, Product } from '@/lib/shopify/types'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { translateClient } from "../../lib/utils/translateClient";
import { usePathname, useRouter } from '@/i18n/navigation'
import React from 'react'



/*function resolveCollectionHandle(
  category?: string,
  type?: string,
  condition?: string
) {
  if (category && category !== 'all') {
    return category?.replace(/-+/g, '-');
  }

  if (type === 'moto-parts') {
    if (condition === 'used') return 'used-parts';
    if (condition === 'new') return 'new-parts';
    return 'moto-parts';
  }

  if (type === 'accessories') return 'accessories';
  if (type === 'collectibles') return 'collectibles';
  if (type === 'motos') return 'motos';

  if (!type && condition === 'used') return 'used-parts';
  if (!type && condition === 'new') return 'new-parts';

  return 'all';
}*/


const ProductListView = ({
  initialData,
  searchParams,
  locale,
}: {
  initialData:any
  searchParams: any
  locale: string
}) => {
  const [isType, setType] = useState("") 
  const [isLoading, setIsLoading] = useState(true)
  const targetElementRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<{
    products: Product[]
    pageInfo: PageInfo
  }>({
    products: [],
    pageInfo: { totalCount: 0, endCursor: '', hasNextPage: false, hasPreviousPage: false }
  })

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
  if (initialData) {
    // Only update state if the products are actually different
    // This prevents the infinite loop
    setData({
      products: initialData.products,
      pageInfo: initialData.pageInfo
    });
    setType(searchParams.t || "")
    setIsLoading(false);
  }
}, [initialData]);

  const {
  sort,
  q: searchValue,
  minPrice,
  maxPrice,
  c: category,
  brand: brand,      // Extracted as 'brand'
  model: model,      // Extracted as 'model'
  component: component,  // Added 'component'
  t: type,
  v: vendor,
  layout,
  cursor,
  condition,
  page
} = searchParams as { [key: string]: string };


  const currentPage = Number(page) || 1;
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort

  const noProductTranslation = translateClient("not-found", "no-product")
  const weTranslation = translateClient("not-found", "we")

  useEffect(() => {
    const fetchData = async () => {
        if (!cursor) return; 

    setIsLoading(true);

    try {
      let productsData: { products: any; pageInfo: any; };
    
          /*const hasFilters =
    (searchValue && searchValue.trim() !== "") ||
    (model && model.trim() !== "") ||
    (brand && brand.trim() !== "") ||
    (component && component.trim() !== "") ||
    (minPrice && minPrice.trim() !== "") ||
    (maxPrice && maxPrice.trim() !== "") ||
    (category && category !== "all" && category.trim() !== "") ||
    (vendor && vendor !== "all" && vendor.trim() !== "") ||
    (type && type !== "all" && type.trim() !== "") ||
    (condition && condition.trim() !== "");
    
          // You can decide: if no filters, do you want to load "all products"?
          if (hasFilters) {
            productsData = await getProducts({ 
              cursor, 
              locale, 
              sortKey, 
              reverse });
            
            console.log('Fetched products with filters:', productsData);

            if (brand) {
              productsData.products = productsData.products.filter((product: Product) => {
                const actualBrand = product.metafields?.find(m => m.key === 'brand')?.value;
                return actualBrand === brand; 
              });
            }
            
            setData({
              products: productsData.products,
              pageInfo: productsData.pageInfo!,
            });
            return;
          }
            */
    
          const filterCategoryProduct: any[] = [];
          const queryParts: string[] = [];
    
          // Price filters
          if (minPrice || maxPrice) {
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;
    
            queryParts.push(`variants.price:>=${min} variants.price:<=${max}`);
    
            filterCategoryProduct.push({
              price: { min, max },
            });
          }
    
          if (searchValue) {
            queryParts.push(searchValue);
          }
    
          if (brand) {
            queryParts.push(`metafield:custom.brand:"${brand}"`);
          }

          if (model) {
            queryParts.push(`metafield:custom.model:"${model}"`);
          }

          if (component && component !== 'None') {
            queryParts.push(`metafield:custom.component:"${component}"`);
          }

          if (condition && condition !== 'all') {
            queryParts.push(`metafield:custom.condition:${condition}`);
          }

          if (type && type !== 'all') {
            queryParts.push(`metafield:custom.type:${type}`);
            console.log("Setting type filter for query:", type);
            setType(type)
          }
    
          if (vendor) {
            queryParts.push(` vendor:"${vendor}"`);
          }
    
          const queryString = queryParts.join(" AND ").trim();
    
          const query = {
            sortKey,
            reverse,
            query: queryString,
          };
    
          //const collectionHandle = resolveCollectionHandle(category, type, condition);
    
          /*if (collectionHandle !== "all") {
            productsData = await getCollectionProducts({
              collection: collectionHandle,
              sortKey,
              reverse,
              locale,
              cursor,
              filterCategoryProduct:
                category &&
                category !== "all" &&
                filterCategoryProduct.length > 0
                  ? filterCategoryProduct
                  : undefined,
            })
          } else {
            productsData = await getProducts({
              ...query,
              cursor,
              locale,
              sortKey,
              reverse,
            });
          }*/

        const hasFilters =
    (searchValue && searchValue.trim() !== "") ||
    (model && model.trim() !== "") ||
    (brand && brand.trim() !== "") ||
    (component && component.trim() !== "") ||
    (minPrice && minPrice.trim() !== "") ||
    (maxPrice && maxPrice.trim() !== "") ||
    (category && category !== "all" && category.trim() !== "") ||
    (vendor && vendor !== "all" && vendor.trim() !== "") ||
    (type && type !== "all" && type.trim() !== "") ||
    (condition && condition.trim() !== "");

  if (hasFilters) {
    // 1. Force the Collection Filter API (Strict Metafield Matching)
    // We use 'all-products' or your specific 'category' handle.
    productsData = await getCollectionProducts({
      collection: 'all', // Ensure this collection exists in Admin!
      brand,
      model,
      component,
      type,
      condition,
      sortKey,
      reverse,
      locale,
      cursor
    });


    // 2. Safety fallback if the collection doesn't exist or query fails
    if (!productsData || !productsData.products) {
       productsData = { products: [], pageInfo: null };
    }

    // 3. The "Double Lock" Strict Filter
    // If Shopify returns it, we verify the data one last time in JS.
    if (productsData.products.length > 0 && (brand || model || (component && component !== 'None'))) {
      productsData.products = productsData.products.filter((product: Product) => {
        const mFields = product.metafields || [];
        
        // If these metafields are MISSING from your GraphQL fragment, 
        // this will return false and hide everything.
        const matchesBrand = brand 
          ? mFields.find(m => m?.key === 'brand')?.value === brand 
          : true;
        const matchesModel = model 
          ? mFields.find(m => m?.key === 'model')?.value === model 
          : true;
        const matchesComponent = (component && component !== 'None') 
          ? mFields.find(m => m?.key === 'component')?.value === component 
          : true;

        return matchesBrand && matchesModel && matchesComponent;
      });
    }
  } else {
    // No filters? Use standard fetch.
    console.log("No filters applied, fetching products without collection filter...");
  }


        setData((prev) => ({
          products: productsData.products,
          pageInfo: {
            // 1. Keep previous values as a base (to preserve totalCount)
            ...prev.pageInfo,
            // 2. Spread new values
            ...productsData.pageInfo,
            // 3. Force defaults so they are never undefined
            hasNextPage: productsData.pageInfo?.hasNextPage ?? false,
            hasPreviousPage: productsData.pageInfo?.hasPreviousPage ?? false,
            endCursor: productsData.pageInfo?.endCursor ?? '',
            // 4. Specifically ensure totalCount persists
            totalCount: productsData.pageInfo?.totalCount ?? prev.pageInfo.totalCount ?? 0,
          } as PageInfo // 5. Tell TS this matches your interface
        }));
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [
    cursor, 
    page, 
    sortKey, 
    searchValue, 
    minPrice, 
    maxPrice, 
    category, 
    reverse, 
    model, 
    brand, 
    vendor, 
    type, 
    condition, 
    component, 
    locale])

  const { products, pageInfo } = data
  const hasNextPage = pageInfo?.hasNextPage || false
  const hasPreviousPage = pageInfo?.hasPreviousPage || false

  const handlePageChange = (targetPage: number) => {
  const params = new URLSearchParams(searchParams); 

        console.log("Fetched products with collection filter:", isType);


  if (targetPage === 1) {
    params.delete('cursor');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  } else if (targetPage > currentPage) {
    // Only go forward if we have the cursor
    if (!pageInfo.endCursor) return;
    params.set('cursor', pageInfo.endCursor);
    params.set('page', targetPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  } else if (targetPage < currentPage) {
    // Go back using browser history to return to previous cursor
    window.history.back();
  }
};

  const productsPerPage = 24;
  const totalCount = pageInfo?.totalCount || (products.length > 0 ? 24 : 0); 
  const totalPages = Math.ceil(totalCount / productsPerPage) || 1;

  const getPaginationNumbers = () => {
  const pages = new Set<(number | string)>();
  pages.add(1);
  if (currentPage > 3) {
    pages.add('...start');
  }

  if (currentPage > 2) {
    pages.add(currentPage - 1);
  }
  
  if (currentPage !== 1) {
    pages.add(currentPage);
  }

  if (hasNextPage) {
    pages.add(currentPage + 1);
    pages.add('...end');
  }
  return Array.from(pages);
};

  const pageNumbers = getPaginationNumbers();

  if (isLoading) {
    return <SkeletonCards />
  }

  const resultsText = products.length > 1 ? 'results' : 'result'

  return (
    <section>
      <div ref={targetElementRef} className='row'>
        {searchValue ? (
          <p className='mb-4'>
            {products.length === 0
              ? 'There are no products that match '
              : `Showing ${products.length} ${resultsText} for `}
            <span className='font-bold'>&quot;{searchValue}&quot;</span>
          </p>
        ) : null}

        {products?.length === 0 && (
          <div className="flex flex-col items-center mx-auto pt-5 text-center">
            <ImageFallback
              className="mx-auto mb-6 w-[211px] h-[184px]"
              src="/images/no-search-found.png"
              alt="no-search-found"
              width={211}
              height={184}
              priority={true}
            />
            <h1 className="h2 mt-4 mb-4">{noProductTranslation}</h1>
            <p>
              {weTranslation}
            </p>
          </div>
        )}

        <div className='row space-y-10'>
          {products?.map((product: Product) => {
            const { id, title, variants, handle, featuredImage, description } = product

            const defaultVariantId = variants.length > 0 ? variants[0].id : undefined

            return (
              <div className='col-12' key={id}>
                <div className='flex gap-5 group'>
                  <div className="relative w-full aspect-square overflow-hidden rounded-md border bg-white group">
                    <Link
                      href={`/products/${handle}`}>
                      <ImageFallback
                        src={featuredImage?.url || '/images/product_image404.jpg'}
                        alt={featuredImage?.altText || 'product image'}
                        fill
                        className="absolute top-0 left-0 w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <img
                        src="/images/logo.png"
                        width={40}
                        height={20}
                        alt="Logo"
                        className="absolute top-3 right-3"
                      />
                    </Link>
                  </div>

                  <div className='col-6 md:col-7 lg:col-5 xl:col-8 max-md:pt-4 '>
                    <h3 className='font-bold md:font-normal h5 line-clamp-2 md:line-clamp-3'>
                      <Link href={`/products/${handle}`}>{title}</Link>
                    </h3>

                    <div className='flex items-center gap-x-2 mt-2'>
                      <span className="text-base md:text-lg font-bold text-text-dark dark:text-darkmode-text-dark">
                        {product?.priceRange?.minVariantPrice?.currencyCode}
                        {" "}
                        {product?.priceRange?.minVariantPrice?.amount}{" "}
                      </span>
                      {parseFloat(
                        product?.compareAtPriceRange?.maxVariantPrice?.amount,
                      ) > 0 ? (
                        <s className="text-text-light text-base-sm dark:text-darkmode-text-light text-xs md:text-base font-medium">
                          {
                            product?.compareAtPriceRange?.maxVariantPrice
                              ?.currencyCode
                          }
                          {" "}
                          {product?.compareAtPriceRange?.maxVariantPrice?.amount}{" "}
                        </s>
                      ) : (
                        ""
                      )}
                    </div>

                    <p className='max-md:text-xs text-justify text-text-light dark:text-darkmode-text-light my-4 md:mb-8 line-clamp-2'>
                      {description}
                    </p>
                    {isType !== "motocycles" && (
                    <Suspense>
                      <AddToCart
                        variants={product?.variants}
                        availableForSale={product?.availableForSale}
                        handle={handle}
                        defaultVariantId={defaultVariantId}
                        stylesClass={'btn btn-outline-primary max-md:btn-sm drop-shadow-md'}
                      />
                    </Suspense>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* PAGINATION BAR */}
        <div className="flex justify-center items-center mt-24 pb-10">
          <nav className="inline-flex items-center rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 border-r border-gray-200"
            >
              ❮ Previous
            </button>

            {/* Numbers */}
            <div className="flex items-center h-full">
              {pageNumbers.map((pageVal, index) => {
                const isDots = typeof pageVal === 'string' && pageVal.startsWith('...');
                const label = isDots ? '...' : pageVal;

                return (
                  <React.Fragment key={index}>
                    {isDots ? (
                      <span className="px-4 h-full flex items-center text-gray-400 border-r border-gray-200">
                        {label}
                      </span>
                    ) : (
                      <button
                        // Ensure we compare against the actual number value
                        onClick={() => typeof pageVal === 'number' && handlePageChange(pageVal)}
                        // Sequential navigation: Only allow clicking 1, current-1, or current+1
                        disabled={
                          pageVal === currentPage || 
                          (pageVal !== 1 && pageVal !== currentPage + 1 && pageVal !== currentPage - 1)
                        }
                        className={`px-4 h-full text-sm font-bold transition-all border-r border-gray-200 flex items-center ${
                          currentPage === pageVal
                            ? 'bg-white text-black border-2 border-black z-10' // Active Box
                            : 'text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                        }`}
                      >
                        {label}
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
            >
              Next ❯
            </button>
          </nav>
        </div>

    </section >
  )
}

export default ProductListView
