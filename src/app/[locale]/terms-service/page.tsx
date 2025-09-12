import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked'; 
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import SeoMeta from '@/partials/SeoMeta';
import PageHeader from '@/partials/PageHeader'

export default async function ServicePage({
    params,
}: {
    params: { locale: (typeof routing.locales)[number] };
}) {
    const { locale } = params;
    const filePath = path.join(process.cwd(), 'src/content/pages', locale, 'terms-service.md');

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    const html = marked(content);

    return (
        <>
            <SeoMeta {...frontmatter} />
            <PageHeader title={frontmatter.title} />
            <section className="section">
                <div className="container prose dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </section>
        </>
    );
}