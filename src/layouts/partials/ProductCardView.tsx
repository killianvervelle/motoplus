"use client";

import { AddToCart } from "@/components/cart/AddToCart";
import SkeletonCards from "@/components/loadings/skeleton/SkeletonCards";
import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import useLoadMore from "@/hooks/useLoadMore";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { PageInfo, Product } from "@/lib/shopify/types";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { translateClient } from "../../lib/utils/translateClient";


const ProductCardView = ({
  searchParams,
  locale,
}: {
  searchParams: any
  locale: string
}) => {
  const { currencySymbol } = config.shopify;
  const [isLoading, setIsLoading] = useState(true);
  const targetElementRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    products: Product[];
    pageInfo: PageInfo;
  }>({
    products: [],
    pageInfo: { endCursor: "", hasNextPage: false, hasPreviousPage: false },
  });

  const {
    sort,
    q: searchValue,
    minPrice,
    maxPrice,
    c: category,
    m: model,
    b: brand,
    v: vendor,
    t: type,
    condition: condition,
    cursor,
  } = searchParams as {
    [key: string]: string;
  };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const noProductTranslation = translateClient("not-found", "no-product")
  const weTranslation = translateClient("not-found", "we")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let productsData;

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
          let queryString = "";
          const filterCategoryProduct = [];

          const shopifyHandle = category?.replace(/-+/g, '-');

          if (minPrice && maxPrice) {
            filterCategoryProduct.push({
              price: {
                min:
                  minPrice !== undefined && minPrice !== ""
                    ? parseFloat(minPrice)
                    : 0,
                max:
                  maxPrice !== undefined && maxPrice !== ""
                    ? parseFloat(maxPrice)
                    : Number.POSITIVE_INFINITY,
              },
            });
          }

          if (minPrice || maxPrice) {
            queryString += `variants.price:<=${maxPrice} variants.price:>=${minPrice}`;
          }

          if (searchValue) {
            queryString += ` ${searchValue}`;
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

          if (type) {
            queryString += `metafield:custom.type:${type}`;
          }

          const query = {
            sortKey,
            reverse,
            query: queryString,
          };

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
          pageInfo: productsData.pageInfo!,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    cursor,
    sortKey,
    searchValue,
    minPrice,
    maxPrice,
    category,
    reverse,
    model,
    vendor,
    brand,
    type,
    condition
  ]);

  const { products, pageInfo } = data;
  const endCursor = pageInfo?.endCursor || "";
  const hasNextPage = pageInfo?.hasNextPage || false;

  useLoadMore(targetElementRef as React.RefObject<HTMLElement>, () => {
    if (hasNextPage && !isLoading) {
      fetchDataWithNewCursor(endCursor);
    }
  });

  const fetchDataWithNewCursor = async (newCursor: string) => {
    // setIsLoading(true);

    try {
      const res = await getProducts({
        sortKey,
        reverse,
        query: searchValue,
        cursor: newCursor,
        locale
      });

      setData({
        products: [...products, ...res.products],
        pageInfo: res.pageInfo,
      });
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SkeletonCards />;
  }

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <div ref={targetElementRef} className="row">
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
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

      <div className="row gap-y-20 sm:gap-y-10 sm:gap-x-10 md:gap-y-14 xl:gap-x-0 justify-center">
        {products.map((product, index) => {
          const defaultVariantId =
            product?.variants.length > 0 ? product?.variants[0].id : undefined;
          return (
            <div
              key={index}
              className={`text-center col-7 sm:col-5 md:col-5 xl:col-4 group relative 
                ${index % 3 === 0 && products.length > 3 && "xl:border-r-[0.5px] xl:border-[#cecece]"}
                ${index % 3 === 2 && products.length > 3 && "xl:border-l-[0.5px] xl:border-[#cecece]"}`}
            >
              <div className="relative w-full overflow-hidden rounded-md border">  {/*sm:h-60 md:h-[230px]*/}
                <ImageFallback
                  src={
                    product.featuredImage?.url || "/images/product_image404.jpg"
                  }
                  width={380}
                  height={369}
                  alt={product.featuredImage?.altText || "fallback image"}
                  className="w-full h-full object-cover"
                />
                <img
                  src="/images/logo.png"
                  width={40}
                  height={20}
                  alt="Logo"
                  className="absolute top-3 right-3"
                />

                <Suspense>
                  <AddToCart
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    handle={product?.handle}
                    defaultVariantId={defaultVariantId}
                    stylesClass={
                      "btn btn-primary max-md:btn-sm z-10 absolute bottom-0 md:bottom-[-5] left-1/2 transform -translate-x-1/2 md:translate-y-full md:group-hover:-translate-y-6 duration-300 ease-in-out whitespace-nowrap drop-shadow-md"
                    }
                  />
                </Suspense>
              </div>
              <div className="flex flex-col xl:h-32 lg:h-40  justify-between mt-14 md:mt-0 md:py-6 text-center z-20">
                <h2 className="font-medium text-base md:text-lg line-clamp-1 md:line-clamp-2">
                  <Link
                    className="after:absolute after:inset-0"
                    href={`/products/${product?.handle}`}
                  >
                    {product?.title}
                  </Link>
                </h2>
                <div className="flex xl:flex-row flex-col justify-center items-center gap-x-2">
                  <span className="text-base md:text-lg font-bold text-text-dark dark:text-darkmode-text-dark">
                    {currencySymbol}{" "}
                    {product?.priceRange?.minVariantPrice?.amount}{" "}
                  </span>
                  {parseFloat(
                    product?.compareAtPriceRange?.maxVariantPrice?.amount,
                  ) > 0 ? (
                    <s className="text-text-light dark:text-darkmode-text-light text-xs md:text-base font-medium">
                      {currencySymbol}{" "}
                      {product?.compareAtPriceRange?.maxVariantPrice?.amount}{" "}
                      {
                        product?.compareAtPriceRange?.maxVariantPrice
                          ?.currencyCode
                      }
                    </s>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p
        className={
          hasNextPage || isLoading
            ? "opacity-100 flex justify-center"
            : "opacity-0 hidden"
        }
      >
        <BiLoaderAlt className={`animate-spin`} size={30} />
      </p>
    </div>
  );
};

export default ProductCardView;
