import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import '../global.css';
import { Inter, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appName, siteUrl, getHomeUrl, languageAlternates } from '@/lib/shared';
import { i18n, isLocale } from '@/lib/i18n';
import { translations } from '@/lib/layout.shared';
import { messages } from '@/lib/translations';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  preload: false,
});

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const text = messages[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `veCloud Control Panel | ${text.documentation}`,
      template: `%s | ${appName}`,
    },
    description: text.description,
    alternates: {
      canonical: getHomeUrl([], lang),
      languages: languageAlternates(),
    },
    openGraph: { siteName: appName, locale: lang, type: 'website' },
  };
}

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${mono.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nProvider(translations, lang)}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
