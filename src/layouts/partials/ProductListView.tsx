'use client'

import { AddToCart } from '@/components/cart/AddToCart'
import SkeletonCards from '@/components/loadings/skeleton/SkeletonCards'
import ImageFallback from '@/helpers/ImageFallback'
import useLoadMore from '@/hooks/useLoadMore'
import { defaultSort, sorting } from '@/lib/constants'
import { getCollectionProducts, getProducts } from '@/lib/shopify'
import { PageInfo, Product } from '@/lib/shopify/types'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { BiLoaderAlt } from 'react-icons/bi'
import { translateClient } from "../../lib/utils/translateClient";

const ProductListView = ({
  searchParams,
  locale,
}: {
  searchParams: any
  locale: string
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const targetElementRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<{
    products: Product[]
    pageInfo: PageInfo
  }>({
    products: [],
    pageInfo: { endCursor: '', hasNextPage: false, hasPreviousPage: false }
  })

  const {
    sort,
    q: searchValue,
    minPrice,
    maxPrice,
    b: brand,
    m: model,
    c: category,
    v: vendor,
    t: type,
    condition: condition,
    cursor
  } = searchParams as {
    [key: string]: string
  }

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort

  const noProductTranslation = translateClient("not-found", "no-product")
  const weTranslation = translateClient("not-found", "we")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        let productsData

        const hasFilters =
          (searchValue && searchValue.trim() !== "") ||
          (model && model.trim() !== "") ||
          (brand && brand.trim() !== "") ||
          (minPrice && minPrice.trim() !== "") ||
          (maxPrice && maxPrice.trim() !== "") ||
          (category && category !== "all" && category.trim() !== "") ||
          (vendor && vendor !== "all" && vendor.trim() !== "") ||
          (type && type !== "all" && type.trim() !== "") ||
          (condition && condition.trim() !== "");

        if (hasFilters) {
          let queryString = ''
          const filterCategoryProduct = []

          const shopifyHandle = category?.replace(/-+/g, '-');

          if (minPrice && maxPrice) {
            filterCategoryProduct.push({
              price: {
                min: minPrice !== undefined && minPrice !== '' ? parseFloat(minPrice) : 0,
                max: maxPrice !== undefined && maxPrice !== '' ? parseFloat(maxPrice) : Number.POSITIVE_INFINITY
              }
            })
          }

          if (minPrice || maxPrice) {
            queryString += `variants.price:<=${maxPrice} variants.price:>=${minPrice}`
          }

          if (searchValue) {
            queryString += ` ${searchValue}`
          }

          if (brand) {
            queryString += ` tag:'${brand}'`
          }

          if (model) {
            queryString += ` tag:'${model}'`
          }

          if (vendor) {
            queryString += ` vendor:"${vendor}"`;
          }

          //if (tag) {
          //queryString += ` tag:'${tag}'`
          //}

          if (condition) {
            queryString += `metafield:custom.condition:${condition}`;
          }

          if (type) {
            queryString += `metafield:custom.type:${type}`;
          }

          const query = {
            sortKey,
            reverse,
            query: queryString
          }

          if (category && category !== 'all') {
            // Filter by collection (category)
            productsData = await getCollectionProducts({
              collection: shopifyHandle,
              sortKey,
              reverse,
              locale,
              condition, //  supports condition filter within category
              type
            });
          }
          else if (type && type !== 'all') {
            // Filter by metafield (type)
            productsData = await getProducts({
              sortKey,
              reverse,
              locale,
              cursor,
              query: `metafield:custom.type:${type}`,
            });
          }
          else if (condition && condition !== 'all') {
            // Filter by metafield (condition)
            productsData = await getCollectionProducts({
              collection: 'all-products',
              sortKey,
              reverse,
              locale,
              condition,
            });
          }
          else {
            // Case 3: Normal query (no collection/metafield filter)
            productsData = await getProducts({ ...query, cursor, locale });
          }
        } else {
          productsData = await getProducts({ sortKey, reverse, cursor, locale });
        }

        setData({
          products: productsData.products,
          pageInfo: productsData.pageInfo!
        })
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [cursor, sortKey, searchValue, minPrice, maxPrice, category, reverse, model, brand, vendor, type, condition])

  const { products, pageInfo } = data
  const endCursor = pageInfo?.endCursor || ''
  const hasNextPage = pageInfo?.hasNextPage || false

  useLoadMore(targetElementRef as React.RefObject<HTMLElement>, () => {
    if (hasNextPage && !isLoading) {
      fetchDataWithNewCursor(endCursor)
    }
  })

  const fetchDataWithNewCursor = async (newCursor: string) => {
    // setIsLoading(true);

    try {
      const res = await getProducts({
        sortKey,
        reverse,
        query: searchValue,
        cursor: newCursor
      })

      setData({
        products: [...products, ...res.products],
        pageInfo: res.pageInfo
      })
    } catch (error) {
      console.error('Error fetching more products:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
                <div className='row group'>
                  <div className='col-6 md:col-5 lg:col-5 xl:col-4 relative'>
                    <Link
                      href={`/products/${handle}`}>
                      <ImageFallback
                        src={featuredImage?.url || '/images/product_image404.jpg'}
                        width={312}
                        height={269}
                        alt={featuredImage?.altText || 'fallback image'}
                        className='w-full h-[150px] md:h-[269px] object-cover border border-border dark:border-darkmode-border rounded-md'
                      />
                      <img
                        src="/images/logo.png"
                        width={30}
                        height={20}
                        alt="Logo"
                        className="absolute sm:w-11 sm:h-6 top-2 right-2 "
                      />
                    </Link>
                  </div>

                  <div className='col-6 md:col-7 lg:col-5 xl:col-8 py-3 max-md:pt-4 '>
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
                    <Suspense>
                      <AddToCart
                        variants={product?.variants}
                        availableForSale={product?.availableForSale}
                        handle={handle}
                        defaultVariantId={defaultVariantId}
                        stylesClass={'btn btn-outline-primary max-md:btn-sm drop-shadow-md'}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className={hasNextPage || isLoading ? 'opacity-100 flex justify-center' : 'opacity-0 hidden'}>
          <BiLoaderAlt className={`animate-spin`} size={30} />
        </p>
      </div>
    </section >
  )
}

export default ProductListView
