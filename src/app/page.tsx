export const dynamic = "force-dynamic";

import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider from "@/components/HeroSlider";
import SkeletonCategory from "@/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getCollectionProducts, getCollections } from "@/lib/shopify";
import CallToAction from "@/partials/CallToAction";
import FeaturedProducts from "@/partials/FeaturedProducts";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";


const ShowHeroSlider = async () => {
  try {
    const slider = await getCollectionProducts({
      collection: config.shopify.collections.hero_slider, // "Home-page-slider"
    });
    const products = slider?.products ?? [];
    if (!products.length) {
      console.warn('[home] hero_slider empty');
      return null;
    }
    return <HeroSlider products={products} />;
  } catch (e) {
    console.error('[home] hero_slider fetch failed', e);
    return null;
  }
};

const ShowCollections = async () => {
  try {
    const cols = await getCollections();
    if (!cols?.length) {
      console.warn('[home] collections empty');
      return null;
    }
    return <CollectionsSlider collections={cols} />;
  } catch (e) {
    console.error('[home] collections fetch failed', e);
    return null;
  }
};

const ShowFeaturedProducts = async () => {
  try {
    const res = await getCollectionProducts({
      collection: config.shopify.collections.featured_products, // "featured-products"
      reverse: false,
    });
    const products = res?.products ?? [];
    if (!products.length) {
      console.warn('[home] featured_products empty');
      return null;
    }
    return <FeaturedProducts products={products} />;
  } catch (e) {
    console.error('[home] featured_products fetch failed', e);
    return null;
  }
};

const Home = () => {
  const callToAction = getListPage("sections/call-to-action.md");

  return (
    <>
      <SeoMeta />
      <section>
        <div className="container">
          <div className="bg-gradient py-10 rounded-md">
            <Suspense>
              <ShowHeroSlider />
            </Suspense>
          </div>
        </div>
      </section>

      {/* category section  */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Collections</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section>
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Featured Products</h2>
            <p className="md:h5">Explore Today&apos;s Featured Picks!</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>

      <CallToAction data={callToAction} />
    </>
  );
};

export default Home;
