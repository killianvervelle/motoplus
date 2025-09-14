
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import { getProduct,  } from "@/lib/shopify";
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

const ProductSingle = async () => {
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async () => {




  return (
    <>
      <section className="md:section-sm">

      </section>
    </>
  );
};
