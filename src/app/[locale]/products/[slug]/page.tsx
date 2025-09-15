
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";

import Tabs from "@/components/product/Tabs";

import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";


export const generateMetadata = async ({
  params,
}: {
  params: { locale: string; slug: string };
}) => {

  const product = await getProduct(params.slug);
  if (!product) return notFound();

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
};

const ProductSingle = async ({
  params
}: {
  params: { locale: string; slug: string }
}) => {
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle params={params} />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async ({ params }: { params: { locale: string; slug: string } }) => {


  const product = await getProduct(params.slug);

  if (!product) return notFound();

  const {
    id,

    description,
    descriptionHtml,


  } = product;

  const relatedProducts = await getProductRecommendations(id);


  return (
    <>


      {/* Description of a product  */}
      {description && (
        <section>
          <div className="container">
            <div className="row">
              <div className="col-10 lg:col-11 mx-auto">
                <Tabs descriptionHtml={descriptionHtml} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Products section  */}
      <section className="section-bottom">
        <div className="container">
          {relatedProducts?.length > 0 && (
            <>
              <div className="text-center mb-6 md:mb-14 pt-24">
                <h3 className="mb-2">Related Products</h3>
              </div>
              <LatestProducts products={relatedProducts.slice(0, 4)} />
            </>
          )}
        </div>
      </section>
    </>
  );
};
