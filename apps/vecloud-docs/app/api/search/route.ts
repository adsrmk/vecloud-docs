import { i18n, isLocale } from '@/lib/i18n';
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import type { NextRequest } from 'next/server';

// Fumadocs builds the index on the first request to each search handler.
const searches = new Map(i18n.languages.map((locale) => [
  locale,
  createFromSource({
    ...source,
    _i18n: { ...i18n, defaultLanguage: locale, languages: [locale] },
    getPages: () => source.getPages(locale),
  }, { localeMap: { fr: 'french' } }),
]));

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? i18n.defaultLanguage;
  const search = isLocale(locale) ? searches.get(locale) : undefined;
  return search ? search.GET(request) : Response.json([]);
}
