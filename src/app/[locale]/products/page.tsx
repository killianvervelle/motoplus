import LoadingProducts from '@/components/loadings/skeleton/SkeletonProducts'
import ProductLayouts from '@/components/product/ProductLayouts'
import { defaultSort, sorting } from '@/lib/constants'
import { getCollectionProducts, getCollections, getHighestProductPrice, getProducts, getVendors } from '@/lib/shopify'
import { PageInfo, Product } from '@/lib/shopify/types'
import ProductCardView from '@/partials/ProductCardView'
import ProductFilters from '@/partials/ProductFilters'
import ProductListView from '@/partials/ProductListView'
import { Suspense } from 'react'

interface SearchParams {
  sort?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  c?: string;
  t?: string;
  m?: string;
  b?: string;
  v?: string;
  condition?: string;
}

function getVendorCounts(products: Product[]) {
  const uniqueVendors = [...new Set(products.map(p => p.vendor || ""))];
  return uniqueVendors.map(vendor => ({
    vendor,
    productCount: products.filter(p => p.vendor === vendor).length
  }));
}

function getCategoryCounts(products: Product[]) {
  const uniqueCategories = [
    ...new Set(products.flatMap(p => p.collections.nodes.map((c: any) => c.title || "")))
  ];
  return uniqueCategories.map(category => ({
    category,
    productCount: products.filter(p =>
      p.collections.nodes.some((c: any) => c.title === category)
    ).length
  }));
}

const ShowProducts = async ({
  searchParams,
  locale,
}: {
  searchParams: SearchParams
  locale: string
}) => {
  const {
    sort,
    q: searchValue,
    minPrice,
    maxPrice,
    c: category,
    m: model,
    b: brand,
    t: type,
    v: vendor,
    layout,
    cursor,
    condition
  } = searchParams as { [key: string]: string };

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort

  const shopifyHandle = category?.replace(/--/g, '-');

  let productsData: any
  let vendorsWithCounts: { vendor: string; productCount: number }[] = []
  let categoriesWithCounts: { category: string; productCount: number }[] = []

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

    //if (tag) {
    //queryString += ` tag:'${tag}'`
    //}

    if (condition) {
      queryString += ` metafield:custom.condition:${condition}`;
    }

    if (type) {
      queryString += ` metafield:custom.type:${type}`;
    }

    const query = {
      sortKey,
      reverse,
      query: queryString,
      cursor,
      locale
    }
    console.log("query", query)

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
      if (condition && condition !== 'all') {
        productsData = await getProducts({
        sortKey,
        reverse,
        locale,
        cursor,
        query: `metafield:custom.type:${type} AND metafield:custom.condition:${condition}`,
      });
      }
      else {
      productsData = await getProducts({
        sortKey,
        reverse,
        locale,
        cursor,
        query: `metafield:custom.type:${type}`,
      });
      }
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
    else if (vendor && vendor !== 'all') {
      // Filter by vendor
      const vendorQuery = `vendor:'${vendor}'`;
      productsData = await getProducts({
        sortKey,
        reverse,
        query: vendorQuery,
        cursor,
        locale,
      });
    }
    else {
      // Default case (no collection, no vendor, no condition)
      productsData = await getProducts(query);
    }

  } else {
    // Fallback for no filters (base load)
    productsData = await getProducts({ sortKey, reverse, cursor, locale });
  }

  vendorsWithCounts = getVendorCounts(productsData.products);
  categoriesWithCounts = getCategoryCounts(productsData.products);

  const categories = await getCollections(locale)
  const vendors = await getVendors({})

  const tags = [
    ...new Set(
      (productsData as { pageInfo: PageInfo; products: Product[] })?.products.flatMap(
        (product: Product) => product.tags
      )
    )
  ]

  const maxPriceData = await getHighestProductPrice()

  return (
    <>
      <Suspense>
        <ProductLayouts
          categories={categories}
          vendors={vendors}
          tags={tags}
          maxPriceData={maxPriceData}
          vendorsWithCounts={vendorsWithCounts}
          categoriesWithCounts={categoriesWithCounts}
        />
      </Suspense>

      <div className='container'>
        <div className='row'>
          <div className='col-3 hidden lg:block -mt-14'>
            <Suspense>
              <ProductFilters
                categories={categories}
                vendors={vendors}
                tags={tags}
                maxPriceData={maxPriceData!}
                vendorsWithCounts={vendorsWithCounts}
                categoriesWithCounts={categoriesWithCounts}
              />
            </Suspense>
          </div>

          <div className='col-12 lg:col-9 pt-5 pl-5'>
            {layout === 'list' ? (
              <ProductListView searchParams={searchParams} locale={locale} />
            ) : (
              <ProductCardView searchParams={searchParams} locale={locale} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default async function ProductsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params

  return (
    <Suspense fallback={<LoadingProducts />}>
      <ShowProducts searchParams={await searchParams} locale={locale} />
    </Suspense>
  )
}
