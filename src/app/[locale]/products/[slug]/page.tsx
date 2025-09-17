import Social from "@/components/Social";
import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import ShowTags from "@/components/product/ShowTags";
import Tabs from "@/components/product/Tabs";
import config from "@/config/config.json";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import matter from 'gray-matter';
import { translateServer } from "../../../../lib/utils/translateServer";

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {

  const param = await params;
  const product = await getProduct(param.locale, param.slug);
  if (!product) return notFound();

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
};

const ProductSingle = async ({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) => {
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle params={params} />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async ({ params }: { params: Promise<{ locale: string; slug: string }> }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/content/sections/payments-and-delivery.md`);
  const text = await res.text();
  const { data: frontmatter } = matter(text);

  const param = await params;

  const payment_methods = frontmatter.payment_methods;

  const { currencySymbol } = config.shopify;
  const product = await getProduct(param.locale, param.slug);

  if (!product) return notFound();

  const {
    id,
    title,
    description,
    descriptionHtml,
    priceRange,
    images,
    variants,
    tags,
  } = product;

  const relatedProducts = await getProductRecommendations(id);

  const related_title = await translateServer("featuredProducts", "related-products")
  const no_recommendation_title = await translateServer("featuredProducts", "no-recommendation")
  const desc = await translateServer("featuredProducts", "description")
  const tag = await translateServer("featuredProducts", "tags")
  const share = await translateServer("featuredProducts", "share")
  const payment = await translateServer("featuredProducts", "payment")
  const delivery = await translateServer("featuredProducts", "delivery")

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;

  return (
    <>
      <section className="md:section-sm">
        <div className="container">
          <div className="row justify-center">
            {/* left side contents  */}
            <div className="col-10 md:col-8 lg:col-6">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense>
            </div>

            <div className="col-10 md:col-8 lg:col-5 md:ml-7 py-6 lg:py-0">
              <h1 className="text-3xl md:h2 mb-2 md:mb-6">{title}</h1>

              <div className="flex gap-2 items-center">
                <h4 className="text-[#c60404] max-md:h2">
                  {currencySymbol} {priceRange?.minVariantPrice.amount}{" "}
                  {priceRange?.minVariantPrice?.currencyCode}
                </h4>

              </div>

              <div className="flex gap-4 mt-8 md:mt-10 mb-6">
                <Suspense>
                  <AddToCart
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    stylesClass={"btn max-md:btn-sm btn-primary hover:bg-gray-700"}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
              </div>

              <div className="mb-8 md:mb-10">
                <p className="p-2 max-md:text-sm rounded-md bg-light dark:bg-darkmode-light inline">
                  {delivery}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h5 className="max-md:text-base">{payment}: </h5>
                {payment_methods?.map(
                  (payment: { name: string; image_url: string }) => (
                    <img
                      key={payment.name}
                      src={payment.image_url}
                      alt={payment.name}
                      width={44}
                      height={40}
                      className="w-[44px] h-[40px]"
                    />
                  ),
                )}
              </div>

              <hr className="my-6 border border-[#cecece] dark:border-border/40" />

              <div className="flex gap-3 items-center mb-6">
                <h5 className="max-md:text-base">{share}:</h5>
                <Social socialName={title} className="social-icons" />
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-3 items-center">
                  <h5 className="max-md:text-base">{tag}:</h5>
                  <Suspense>
                    <ShowTags tags={tags} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description of a product  */}
      {description && (
        <section>
          <div className="container">
            <div className="row">
              <div className="col-10 lg:col-11 mx-auto">
                <Tabs descriptionHtml={descriptionHtml} title={desc} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Products section  */}
      <section className="section-bottom">
        <div className="container">
          {relatedProducts?.length > 0 ? (
            <>
              <div className="text-center mb-6 md:mb-14 pt-24">
                <h3 className="mb-2">{related_title}</h3>
              </div>
              <LatestProducts products={relatedProducts.slice(0, 4)} />
            </>
          ) : (
            <>
              <div className="text-center pt-24">
                <h3>{related_title}</h3>
              </div>
              <div className="text-center mb-6 md:mb-14 pt-10">
                <p className="text-gray-500">{no_recommendation_title}</p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};
