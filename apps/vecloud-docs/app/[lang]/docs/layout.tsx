import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { isLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { getDocsUrl } from '@/lib/shared';
import { messages } from '@/lib/translations';

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
      sidebar={{ className: 'bg-fd-card' }}
      tabMode="navbar"
      tabs={[
        { title: messages[lang].documentation, url: getDocsUrl([], lang) },
        { title: 'Control Panel', url: 'https://panel.vecloud.eu' },
      ]}
      {...options}
      nav={{ ...options.nav, mode: 'top' }}
    >
      {children}
    </DocsLayout>
  );
}
