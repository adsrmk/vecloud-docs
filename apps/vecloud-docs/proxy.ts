import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { i18n } from '@/lib/i18n';
import { getDocsUrl } from '@/lib/shared';

const localize = createI18nMiddleware(i18n);
const markdownRewrites = i18n.languages.map((locale) => {
  const path = getDocsUrl([], locale);
  return rewritePath(`${path}{/*path}`, `/llms.mdx${path}{/*path}.md`).rewrite;
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  if (/\.(md|txt)$/.test(pathname)) return NextResponse.next();
  if (isMarkdownPreferred(request)) {
    for (const rewrite of markdownRewrites) {
      const path = rewrite(pathname);
      if (!path) continue;
      const target = new URL(path, request.url);
      target.search = request.nextUrl.search;
      return NextResponse.rewrite(target, { headers: { Vary: 'Accept' } });
    }
  }
  return localize(request, event);
}

export const config = {
  matcher: ['/', '/docs/:path*', '/:lang(nl|en|es|fr|de)/:path*'],
};
