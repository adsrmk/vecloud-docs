import { createGetUrl } from 'fumadocs-core/source';

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

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
