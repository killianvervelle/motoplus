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
  sort?: string
  q?: string
  minPrice?: string
  maxPrice?: string
  c?: string
  t?: string
  m?: string
  b?: string
  v?: string
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
    t: tag,
    v: vendor,
    layout,
    cursor
  } = searchParams as {
    [key: string]: string
  }

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort

  const shopifyHandle = category?.replace(/--/g, '-');

  let productsData: any
  let vendorsWithCounts: { vendor: string; productCount: number }[] = []
  let categoriesWithCounts: { category: string; productCount: number }[] = []

  if (searchValue || model || brand || minPrice || maxPrice || category || vendor) {
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

    if (tag) {
      queryString += ` tag:'${tag}'`
    }

    const query = {
      sortKey,
      reverse,
      query: queryString,
      cursor,
      locale
    }


    if (category && category !== 'all') {
      productsData = await getCollectionProducts({
        collection: shopifyHandle,
        sortKey,
        reverse,
        locale
      })
    }
    else if (vendor && vendor !== 'all') {
      const vendorQuery = `vendor:'${vendor}'`;
      productsData = await getProducts({
        sortKey,
        reverse,
        query: vendorQuery,
        cursor,
        locale
      });
    }
    else {
      productsData = await getProducts(query)
    }

    const uniqueVendors: string[] = [
      ...new Set(((productsData?.products as Product[]) || []).map((product: Product) => String(product?.vendor || '')))
    ]

    const uniqueCategories: string[] = [
      ...new Set(
        ((productsData?.products as Product[]) || []).flatMap((product: Product) =>
          product.collections.nodes.map((collectionNode: any) => collectionNode.title || '')
        )
      )
    ]

    vendorsWithCounts = uniqueVendors.map((vendor: string) => {
      const productCount = (productsData?.products || []).filter(
        (product: Product) => product?.vendor === vendor
      ).length
      return { vendor, productCount }
    })

    categoriesWithCounts = uniqueCategories.map((category: string) => {
      const productCount = ((productsData?.products as Product[]) || []).filter((product: Product) =>
        product.collections.nodes.some((collectionNode: any) => collectionNode.title === category)
      ).length
      return { category, productCount }
    })
  } else {
    productsData = await getProducts({ sortKey, reverse, cursor, locale })
  }
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
  // locale is the dynamic [locale] segment
  const { locale } = await params

  // searchParams is already a plain object, no need to await
  return (
    <Suspense fallback={<LoadingProducts />}>
      <ShowProducts searchParams={await searchParams} locale={locale} />
    </Suspense>
  )
}
