import { NextResponse, type NextRequest } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';

const markdown = rewritePath('/:lang/docs{/*path}', '/llms.mdx/:lang/docs{/*path}.md');

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/\.(md|txt)$/.test(pathname)) return NextResponse.next();
  const headers = { Vary: 'Accept' };
  const path = isMarkdownPreferred(request) && markdown.rewrite(pathname);
  if (!path) return NextResponse.next({ headers });
  const target = request.nextUrl.clone();
  target.pathname = path;
  return NextResponse.rewrite(target, { headers });
}

// next.config.mjs handles the root and unprefixed Docs redirects first.
export const config = {
  matcher: '/:lang(nl|en|es|fr|de)/docs/:path*',
};
