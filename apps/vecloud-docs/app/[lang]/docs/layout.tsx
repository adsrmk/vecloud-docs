import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { isLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const options = baseOptions(lang);
  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      sidebar={{ className: 'bg-fd-card', collapsible: false }}
      tabs={false}
      {...options}
      nav={{ ...options.nav, mode: 'top' }}
    >
      {children}
    </DocsLayout>
  );
}
