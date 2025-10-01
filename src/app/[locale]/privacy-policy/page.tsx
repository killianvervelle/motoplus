import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import SeoMeta from '@/partials/SeoMeta';
import PageHeader from '@/partials/PageHeader'

export default async function ServicePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const filePath = path.join(process.cwd(), 'public/content/pages', locale, 'privacy-policy.md');

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    const html = await marked(content);

    return (
        <>
            <SeoMeta {...frontmatter} />
            <PageHeader title={frontmatter.title} />
            <section className="section-bottom">
                <div className="container prose dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </section>
        </>
    );
}