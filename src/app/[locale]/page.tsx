import CollectionsSlider from "@/components/CollectionsSlider";
//import HeroSlider from "@/components/HeroSlider";
import SkeletonCategory from "@/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import { getLatestProducts } from "@/lib/shopify"; //getCollectionProducts, 
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
import Testimonials from '@/partials/Testimonials'
import { FaBoxOpen, FaTools } from 'react-icons/fa'
import { IoDiamondSharp } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";
import { Testimonial } from '@/types'
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

/*const ShowHeroSlider = async () => {
  const sliderImages = await getCollectionProducts({
    collection: collections.hero_slider,

  });
  const { products } = sliderImages;
  return <HeroSlider products={products} />;
};*/

const ShowLatestProducts = async ({
  locale,
}: {
  locale: string
}) => {
  const collections = await getLatestProducts(locale);
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

const aboutUsSlugs = {
  translatedTitle: "title",
  translatedFaqTitle: "faq-section-title",
  translatedFaqSubTitle: "faq-section-subtitle",
  translatedTestimonialTitle: "testimonials-section-title",
  translatedValueTitle: "reasons",
  translatedMissionTitle: "direct",
  translatedVisionTitle: "third-party",
  translatedTeamFastSecure: "fast-secure",
  translatedTeamQuality: "quality",
  translatedTeamInspected: "inspected",
  translatedCtaTitle: "delivery",
  translatedCustomer: "customer",
  translatedSupport: "support"
};

/*const ShowFeaturedProducts = async () => {
  const { products } = await getCollectionProducts({
    collection: collections.featured_products,
    reverse: false,
  });
  return <FeaturedProducts products={products} />;
};*/

const Home = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const translatedSeeAll = await translateServer("featuredProducts", "see-all-products")
  const translatedLatestArrivals = await translateServer("home", "latest-arrivals")
  const totalProducts = await getTotalNumberOfProducts();

  const { locale } = await params;

  const filtersComponents: [string, string[]][] = await Promise.all(
    Object.entries(GROUPS).map(async ([key, options]) => {
      const translatedKey = await translateServer("filters", key);
      const translatedValues = await Promise.all(
        options.map(async (option) => await translateServer("filters", option))
      )
      return [translatedKey, translatedValues]
    })
  );

  const sortedFiltersComponents = filtersComponents
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([translatedKey, translatedValues]) => [
      translatedKey,
      [...translatedValues].sort((a, b) => a.localeCompare(b))
    ]);

  const t = await getTranslations('filterbox');

  const translations = await Promise.all(
    Object.entries(aboutUsSlugs).map(([key, slug]) =>
      translateServer("about-us", slug).then((value) => [key, value])
    )
  );

  const translated = Object.fromEntries(translations) as Record<
    keyof typeof aboutUsSlugs,
    string
  >;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/content/about/_index.md`);
  const text = await res.text();
  const { data: frontmatter } = matter(text);
  const testimonials_section_enable = frontmatter.testimonials_section_enable;


  const filePath = path.join(process.cwd(), 'public/content/pages', locale, "home.md")

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: homeFrontmatter } = matter(fileContent);


  const translatedTestimonials = await Promise.all(
    frontmatter.testimonials.map(
      async (item: Testimonial) => {
        const name = await translateServer("about-us", item.slug_name)
        const designation = await translateServer("about-us", item.slug_designation)
        const content = await translateServer("about-us", item.slug_content)
        const image = await translateServer("about-us", item.avatar)
        return { name, designation, content, image }
      }
    )
  )

  return (
    <>
      <SeoMeta {...homeFrontmatter} />
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
              filtersComponents={Object.fromEntries(sortedFiltersComponents)}
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
          <div className="text-center sm:pt-20 md:pt-0 mb-6 md:mb-14">
            <h3>{translatedLatestArrivals}</h3>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowLatestProducts locale={locale} />
          </Suspense>
        </div>
        <Suspense fallback={<SkeletonFeaturedProducts />}>
          {/*<ShowFeaturedProducts />*/}
          <div className='flex justify-center mt-7'>
            <Link className='btn btn-sm md:btn-md hover:bg-gray-700 btn-primary font-medium' href={'/products'}>
              {translatedSeeAll}
            </Link>
          </div>
        </Suspense>
      </section >

      {/* values section  */}
      < section className='section-bottom bg-[#232222] dark:bg-darkmode-light mb-24' >
        <div className="container">
          <div className="text-center text-light">
            <div className='row justify-center py-20 gap-1 lg:gap-0 mt-14'>
              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <FaTools size={48} className="text-[#c60404]" />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 text-light pb-6 md:pb-0'>{translated.translatedMissionTitle}</h5>
                <p className="mx-5">{translated.translatedVisionTitle}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <FaBoxOpen size={48} className="text-[#c60404]" />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 text-light pb-6 md:pb-0'>{translated.translatedTeamFastSecure}</h5>
                <p className="mx-5">{translated.translatedCtaTitle}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <IoDiamondSharp size={48} className="text-[#c60404]" />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 text-light pb-6 md:pb-0'>{translated.translatedTeamQuality}</h5>
                <p className="mx-5">{translated.translatedTeamInspected}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <RiCustomerService2Fill size={48} className="text-[#c60404]" />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 text-light pb-6 md:pb-0'>{translated.translatedCustomer}</h5>
                <p className="mx-5">{translated.translatedSupport}</p>
              </div>
            </div>
          </div>
        </div>

      </section >

      {/* testimonials section  */}
      < section className="section-bottom" >
        <div className="container">
          <Suspense>
            {testimonials_section_enable && <Testimonials title={translated.translatedTestimonialTitle!} testimonials={translatedTestimonials!} />}
          </Suspense>
        </div>
      </section >

    </>
  );
};

export default Home;


