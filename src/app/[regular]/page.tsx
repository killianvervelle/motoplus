import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

// Generate static params
export const generateStaticParams = () => {
  const regularPages = getSinglePage("pages").map((page: RegularPage) => ({
    regular: page.slug,
  }));
  console.log('Static regular slugs:', regularPages.map(p => p));
  return regularPages;
};

// For all regular pages
export default async function RegularPages({
  params,
}: {
  params: { regular: string };
}) {
  // Make sure this function works in prod (Node runtime), not Edge
  const all = getSinglePage('pages');
  const data = all.find((p: RegularPage) => p.slug === params.regular);

  console.log('Static regular slugs:', data);

  if (!data) return notFound();

  const { frontmatter, content } = data;
  const { title, meta_title, description, image } = frontmatter;

  return (
    <>
      <SeoMeta title={title} meta_title={meta_title} description={description} image={image} />
      <PageHeader title={title} />
      <section className="section">
        <div className="container">
          <div className="content">
            <MDXContent content={content} />
          </div>
        </div>
      </section>
    </>
  );
}