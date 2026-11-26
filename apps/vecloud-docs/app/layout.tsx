import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, siteUrl } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'veCloud Control Panel | Documentatie',
    template: `%s | ${appName}`,
  },
  description:
    'Handleidingen voor websites, WordPress, e-mail, DNS, SSL en back-ups in het veCloud Control Panel.',
  openGraph: { siteName: appName, locale: 'nl_NL', type: 'website' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="nl" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={{
            locale: 'nl',
            translations: {
              'Search(search trigger)': 'Zoeken',
              'Open Search(search trigger)(aria-label)':
                'Documentatie doorzoeken',
              'Search(search dialog)': 'Zoeken',
              'Close Search(search dialog)(aria-label)': 'Zoeken sluiten',
              'No results found(search dialog)': 'Geen resultaten gevonden',
              'On this page(table of contents)': 'Op deze pagina',
              'Previous Page(pagination)': 'Vorige pagina',
              'Next Page(pagination)': 'Volgende pagina',
              'Light(theme switcher)(aria-label)': 'Licht',
              'Dark(theme switcher)(aria-label)': 'Donker',
              'System(theme switcher)(aria-label)': 'Systeem',
              'Toggle Theme(theme switcher)(aria-label)': 'Thema wijzigen',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
