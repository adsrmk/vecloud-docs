import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, languageAlternates } from '@/lib/shared';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export default async function Page(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      className="md:ps-8 xl:ps-10"
    >
      <DocsTitle className={`docs-article-title ${geist.variable}`}>
        {page.data.title}
      </DocsTitle>
      <DocsDescription className="text-sm leading-5">
        {page.data.description}
      </DocsDescription>
      <DocsBody className={`docs-article-body ${geist.variable}`}>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      languages: languageAlternates(page.slugs),
    },
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
