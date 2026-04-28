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
  brand?: string;     // Matches params.set("brand", ...)
  model?: string;     // Matches params.set("model", ...)
  component?: string; // Matches params.set("component", ...)
  v?: string;
  t?: string;
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
  brand: brand,      // Extracted as 'brand'
  model: model,      // Extracted as 'model'
  component: component,  // Added 'component'
  t: type,
  v: vendor,
  layout,
  cursor,
  condition
} = searchParams as { [key: string]: string };

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort

  const shopifyHandle = category?.replace(/--/g, '-');

  let productsData: any
  //let vendorsWithCounts: { vendor: string; productCount: number }[] = []
  //let categoriesWithCounts: { category: string; productCount: number }[] = []

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
    /*if (productsData.products.length > 0) {
      productsData.products = productsData.products.filter((product: Product) => {
        console.log(`Checking product: ${product.title} (Product: ${product})`);
        const mFields = product.metafields || [];
        
        // If these metafields are MISSING from your GraphQL fragment, 
        // this will return false and hide everything.
        if (brand || model || (component && component !== 'None')) {
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
        }
      });
    }*/
  } else {
    // No filters? Use standard fetch.
    console.log("No filters applied, fetching products without collection filter...");
    productsData = await getCollectionProducts({
      collection: 'all', 
      sortKey,
      reverse,
      locale,
      cursor
    });
  }

  //vendorsWithCounts = getVendorCounts(productsData.products);
  //categoriesWithCounts = getCategoryCounts(productsData.products);

  //const categories = await getCollections(locale)
  //const vendors = await getVendors({})

  function getMetafieldCounts(products: Product[], metafieldKey: string, labelKey: string) {
  const counts: Record<string, number> = {};
  if (!products || products.length === 0) return [];
  products.forEach(p => {
    const val = p.metafields?.find(m => m?.key === metafieldKey)?.value;
    if (val) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, count]) => ({
    [labelKey]: name,       // Dynamically set 'brand', 'model', etc.
    productCount: count     // Standardize on 'productCount'
  })).sort((a, b) => (a[labelKey] as string).localeCompare(b[labelKey] as string));
}

    const brandFilters = getMetafieldCounts(productsData.products, 'brand', 'brand') as 
  { brand: string; productCount: number }[];

const modelFilters = getMetafieldCounts(productsData.products, 'model', 'model') as 
  { model: string; productCount: number }[];

const componentFilters = getMetafieldCounts(productsData.products, 'component', 'component') as 
  { component: string; productCount: number }[];
  
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
          brands={brandFilters}
          models={modelFilters}
          components={componentFilters}
          maxPriceData={maxPriceData}
          //vendorsWithCounts={vendorsWithCounts}
          //categoriesWithCounts={categoriesWithCounts}
        />
      </Suspense>

      <div className='container'>
        <div className='row'>
          <div className='col-3 hidden lg:block -mt-14'>
            <Suspense>
              <ProductFilters
                brands_={brandFilters}
                models_={modelFilters}
                components_={componentFilters}
                maxPriceData={maxPriceData!}
              />
            </Suspense>
          </div>

          <div className='col-12 lg:col-9 pt-5 pl-5'>
            {layout === 'list' ? (
              <ProductListView initialData={productsData} searchParams={searchParams} locale={locale} />
            ) : (
              <ProductCardView initialData={productsData} searchParams={searchParams} locale={locale} />
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
