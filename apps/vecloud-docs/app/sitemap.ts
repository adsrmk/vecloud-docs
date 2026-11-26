import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { languageAlternates, siteUrl } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of i18n.languages) {
    for (const page of source.getPages(locale)) {
      entries.push({
        url: siteUrl + page.url,
        alternates: { languages: absoluteLanguages(page.slugs) },
      });
    }
  }
  return entries;
}

function absoluteLanguages(slugs?: string[]) {
  const languages = languageAlternates(slugs);
  for (const locale in languages)
    languages[locale] = siteUrl + languages[locale];
  return languages;
}
