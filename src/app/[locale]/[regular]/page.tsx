import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { notFound } from "next/navigation";
import { useLocale } from 'next-intl'
import { RegularPage } from "@/types";


export const dynamic = 'force-dynamic';

export const generateStaticParams = () => {
  const regularPages = getSinglePage("pages").map((page: RegularPage) => ({
    regular: page.frontmatter.main_slug_title,
  }));
  console.log('Static regular slugs:', regularPages.map(p => p));
  return regularPages;
};

export default async function RegularPages({
  params,
}: {
  params: { regular: string };
}) {
  const locale = useLocale()
  const all = getSinglePage(`pages/${locale}`)
  const data = all.find((p) => p.slug === params.regular);

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