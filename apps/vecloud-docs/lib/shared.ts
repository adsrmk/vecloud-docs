import { createGetUrl } from 'fumadocs-core/source';
import { i18n } from './i18n';

export const appName = 'veCloud Docs';
export const siteUrl = 'https://docs.vecloud.eu';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'adsrmk',
  repo: 'vecloud-docs',
  branch: 'dev',
};

const getImageUrl = createGetUrl(docsImageRoute);
export const getHomeUrl = createGetUrl('', i18n);
export const getDocsUrl = createGetUrl(docsRoute, i18n);

export function languageAlternates(slugs?: string[]) {
  const getUrl = slugs ? getDocsUrl : getHomeUrl;
  return Object.fromEntries([
    ...i18n.languages.map((locale) => [locale, getUrl(slugs ?? [], locale)]),
    ['x-default', getUrl(slugs ?? [], i18n.defaultLanguage)],
  ]);
}

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: getImageUrl([page.locale ?? i18n.defaultLanguage, ...segments]),
  };
}
