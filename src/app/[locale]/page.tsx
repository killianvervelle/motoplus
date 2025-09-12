import CollectionsSlider from "@/components/CollectionsSlider";
//import HeroSlider from "@/components/HeroSlider";
import SkeletonCategory from "@/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
//import config from "@/config/config.json";
import { /*getCollectionProducts,*/ getLatestProducts } from "@/lib/shopify";
//import FeaturedProducts from "@/partials/FeaturedProducts";
import SeoMeta from "@/partials/SeoMeta";
import Writing from "@/partials/Writing";
import { Suspense } from "react";
import Link from 'next/link'
import { translateServer } from "../../lib/utils/translateServer";
import Image from "next/image";
import filtersBrands from "../../../motorcycles_simplified.json"
import FilterBox from "@/components/filter/FilterBox";
import { GROUPS } from "@/lib/groups";
import { getTranslations } from 'next-intl/server';

//const { collections } = config.shopify;

export const runtime = 'nodejs';
export const revalidate = 0;

/*const ShowHeroSlider = async () => {
  const sliderImages = await getCollectionProducts({
    collection: collections.hero_slider,

  });
  const { products } = sliderImages;
  return <HeroSlider products={products} />;
};*/

const ShowLatestProducts = async () => {
  const collections = await getLatestProducts();
  return <CollectionsSlider collections={collections} />;
};

const getTotalNumberOfProducts = async () => {
  const token = process.env.SHOPIFY_ADMIN_SECRET;
  if (!token) {
    throw new Error('SHOPIFY_ADMIN_API_TOKEN is not set');
  }

  const response = await fetch(
    'https://motoplus-site76.myshopify.com/admin/api/2025-01/graphql.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
        query {
          productsCount(limit: null) {
            count
          }
        }
      `,
      }),
    }
  );
  const { data } = await response.json();

  return data.productsCount.count;
};

/*const ShowFeaturedProducts = async () => {
  const { products } = await getCollectionProducts({
    collection: collections.featured_products,
    reverse: false,
  });
  return <FeaturedProducts products={products} />;
};*/

const Home = async () => {
  const translatedSeeAll = await translateServer("featuredProducts", "see-all-products")
  const translatedLatestArrivals = await translateServer("home", "latest-arrivals")
  const totalProducts = await getTotalNumberOfProducts();

  const filtersComponents = await Promise.all(
    Object.entries(GROUPS).map(async ([key, options]) => {
      const translatedKey = await translateServer("filters", key);
      const translatedValues = await Promise.all(
        options.map(async (option) => await translateServer("filters", option))
      )
      return [translatedKey, translatedValues]
    })
  );

  const t = await getTranslations('filterbox');

  return (
    <>
      <SeoMeta />
      <section className="section">
        <div className="pb-48 sm:pb-32 md:pb-0">
          <div className="pb-5 overflow-hidden relative">
            <div className="flex flex-col items-center gap-4">
              {/*<Suspense>
              <ShowHeroSlider />
            </Suspense>*/}
              <Image
                src="/images/background.png"
                width={1200}
                height={600}
                alt="Moto plus image"
                className="w-full h-full object-cover"
              />
              <Writing />
            </div>
          </div>
          <div className="absolute w-full h-auto top-1/4 flex justify-center">
            <FilterBox
              filtersBrands={filtersBrands}
              filtersComponents={Object.fromEntries(filtersComponents)}
              totalProducts={totalProducts}
              title={t('title')}
              subtitle={t('subtitle')}
              brand={t('brand')}
              model={t('model')}
              part={t('part')}
              search={t('search')}
              available={t('available')}
              available2={t('available2')}
            />
          </div>
        </div>
      </section >

      {/* category section  */}
      < section className="section" >
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h3>{translatedLatestArrivals}</h3>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowLatestProducts />
          </Suspense>
        </div>
      </section >

      {/* Featured Products section  */}
      < section >
        <div className="container">
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            {/*<ShowFeaturedProducts />*/}
            <div className='flex justify-center'>
              <Link className='btn btn-sm md:btn-lg hover:bg-gray-700 btn-primary font-medium' href={'/products'}>
                {translatedSeeAll}
              </Link>
            </div>
          </Suspense>
        </div>
      </section >

    </>
  );
};

export default Home;


