import { NextResponse, type NextRequest } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/\.(md|txt)$/.test(pathname) || !isMarkdownPreferred(request)) {
    return NextResponse.next();
  }
  const target = request.nextUrl.clone();
  target.pathname = `/llms.mdx${pathname}.md`;
  return NextResponse.rewrite(target);
}

export const config = {
  matcher: ['/docs/:path*', '/:lang(nl|es|fr|de)/docs/:path*'],
};
