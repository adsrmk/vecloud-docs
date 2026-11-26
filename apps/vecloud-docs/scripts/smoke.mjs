import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdir, readFile, readdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { icons } from 'lucide-react';

const app = new URL('../', import.meta.url);
let base = process.env.DOCS_SMOKE_BASE_URL;
let server;
let output = '';
if (!base) {
  const standalone = new URL('.next/standalone/', app);
  await mkdir(new URL('.next/', standalone), { recursive: true });
  await cp(new URL('public/', app), new URL('public/', standalone), {
    recursive: true,
  });
  await cp(
    new URL('.next/static/', app),
    new URL('.next/static/', standalone),
    { recursive: true },
  );
  const reserve = createServer();
  reserve.listen(0, '127.0.0.1');
  await once(reserve, 'listening');
  const port = reserve.address().port;
  await new Promise((resolve) => reserve.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [new URL('server.js', standalone).pathname],
    {
      cwd: app,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: String(port),
        HOSTNAME: '127.0.0.1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  for (const stream of [server.stdout, server.stderr]) {
    stream.on('data', (value) => {
      output = (output + value).slice(-4000);
    });
  }
}
async function get(path, expected = 200, headers = {}) {
  const response = await fetch(base + path, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, expected, path);
  return response;
}
const locales = ['nl', 'en', 'es', 'fr', 'de'];
const prefix = (locale) => `/${locale}`;
const content = new Map();
const screenshotNames = new Set();
const optimizedScreenshots = new Set();
const screenshotDimensions = JSON.parse(
  await readFile(new URL('lib/screenshot-dimensions.json', app), 'utf8'),
);
const files = await readdir(new URL('content/docs/', app), { recursive: true });
for (const file of files) {
  if (!file.endsWith('.mdx')) continue;
  const match = file.match(/\.(en|es|fr|de)\.mdx$/);
  const locale = match?.[1] ?? 'nl';
  const parts = file.replace(/(?:\.(?:en|es|fr|de))?\.mdx$/, '').split('/');
  const slugs = [];
  for (const part of parts) if (!part.startsWith('(')) slugs.push(part);
  if (slugs.at(-1) === 'index') slugs.pop();
  const path = `/${locale}/docs${slugs.length ? '/' + slugs.join('/') : ''}`;
  assert.ok(!content.has(path), 'Unique route: ' + path);
  const mdx = await readFile(new URL('content/docs/' + file, app), 'utf8');
  assert.match(mdx, /^title: .+/m, file + ' title');
  assert.match(mdx, /^description: .+/m, file + ' description');
  const icon = mdx.match(/^icon: (.+)$/m)?.[1];
  if (icon) assert.ok(icons[icon], file + ' supported icon');
  content.set(path, { mdx, title: mdx.match(/^title: (.+)$/m)[1] });
  for (const [, name] of mdx.matchAll(/<PortalScreenshot\s+name="([^"]+)"/g))
    screenshotNames.add(name);
}
const defaultPages = [];
for (const path of content.keys())
  if (path.startsWith('/nl/')) defaultPages.push(path);
for (const path of defaultPages)
  for (const locale of locales)
    assert.ok(
      content.has('/' + locale + path.slice(3)),
      path + ' translation ' + locale,
    );
const escapeHTML = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
try {
  const deadline = Date.now() + 20000;
  while (true) {
    if (server && server.exitCode !== null) throw new Error(output);
    try {
      if (
        (
          await fetch(base + '/api/health', {
            signal: AbortSignal.timeout(500),
          })
        ).ok
      )
        break;
    } catch {}
    if (Date.now() > deadline) throw new Error('Readiness failed: ' + output);
    await delay(100);
  }
  const sitemap = await (await get('/sitemap.xml')).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)];
  assert.equal(
    pages.length,
    content.size,
    'Every guide appears in the sitemap',
  );
  const counts = Object.fromEntries(locales.map((locale) => [locale, 0]));
  const renderedPages = new Map();
  const internalLinks = new Set();
  for (const [, url] of pages) {
    const location = new URL(url);
    assert.equal(location.origin, 'https://docs.vecloud.eu');
    const path = location.pathname;
    const locale = path.match(/^\/(nl|en|es|fr|de)(?:\/|$)/)?.[1] ?? 'nl';
    const page = content.get(path);
    assert.ok(page, path + ' source exists');
    const { title } = page;
    const html = await (await get(path)).text();
    renderedPages.set(path, html);
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const target = new URL(href.replaceAll('&amp;', '&'), location);
      if (
        target.origin === location.origin &&
        /^\/(nl|en|es|fr|de)\/docs(?:\/|$)/.test(target.pathname)
      )
        internalLinks.add(target.pathname + target.hash);
    }
    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`), path);
    assert.ok(
      html.includes('id="nd-notebook-layout"'),
      path + ' notebook layout',
    );
    assert.ok(html.includes(escapeHTML(title)), path + ' translated title');
    assert.ok(
      html.includes(`rel="canonical" href="${location.href}"`),
      path + ' canonical',
    );
    for (const alternate of locales)
      assert.ok(
        html.includes(`hrefLang="${alternate}"`),
        path + ' alternate ' + alternate,
      );
    assert.ok(!html.includes('Hello World'));
    assert.ok(!html.includes('.mdx"'), path + ' resolved MDX links');
    if (locale !== 'nl')
      assert.ok(
        !/href="\/docs(?:[\/#"])/.test(html),
        path + ' links keep locale',
      );
    for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g))
      if (src.includes('screenshots'))
        optimizedScreenshots.add(src.replaceAll('&amp;', '&'));
    counts[locale]++;
  }
  for (const link of internalLinks) {
    const [path, hash] = link.split('#');
    assert.ok(renderedPages.has(path), 'Internal destination: ' + link);
    if (hash)
      assert.ok(
        renderedPages
          .get(path)
          .includes(`id="${escapeHTML(decodeURIComponent(hash))}"`),
        'Internal anchor: ' + link,
      );
  }
  const queries = {
    nl: 'herstellen',
    en: 'restore',
    es: 'restauración',
    fr: 'restauration',
    de: 'Wiederherstellung',
  };
  const frenchAuthentication = await (
    await get('/api/search?query=authentification&locale=fr')
  ).json();
  assert.ok(
    frenchAuthentication.some((result) =>
      result.url.startsWith('/fr/docs/email/authentication'),
    ),
    'French search finds words after an apostrophe',
  );
  assert.ok(
    frenchAuthentication.every((result) => !/PortalScreenshot/i.test(result.content)),
    'Search excludes screenshot component markup',
  );
  for (const locale of locales) {
    assert.equal(counts[locale], defaultPages.length, locale + ' guide parity');
    const componentSearch = await (
      await get(`/api/search?query=PortalScreenshot&locale=${locale}`)
    ).json();
    assert.equal(componentSearch.length, 0, locale + ' no screenshot code in search');
    const search = await (
      await get(
        `/api/search?query=${encodeURIComponent(queries[locale])}&locale=${locale}`,
      )
    ).json();
    assert.ok(
      search.some((result) =>
        result.url.startsWith(prefix(locale) + '/docs/backups'),
      ),
      locale + ' search',
    );
    assert.ok(
      search.every((result) => result.url.startsWith(prefix(locale) + '/docs')),
      locale + ' search isolation',
    );
    for (const path of [
      prefix(locale) + '/docs/backups.md',
      prefix(locale) + '/docs/backups',
    ]) {
      const markdown = await (
        await get(path, 200, { Accept: 'text/markdown' })
      ).text();
      assert.ok(markdown.startsWith('# '), path);
      assert.ok(!markdown.includes('<!DOCTYPE html>'), path);
    }
    const image = await get(`/og/docs/${locale}/backups/image.png`);
    assert.match(image.headers.get('content-type'), /^image\//);
    await image.arrayBuffer();
    await get(prefix(locale) + '/docs/deze-pagina-bestaat-niet', 404);
    const home = await fetch(base + (prefix(locale) || '/'), {
      redirect: 'manual',
    });
    assert.equal(home.status, 307, locale + ' home redirect');
    assert.equal(
      new URL(home.headers.get('location'), base).pathname,
      prefix(locale) + '/docs',
    );
  }
  for (const name of screenshotNames) {
    for (const theme of ['light', 'dark']) {
      const path = `/screenshots/${name}-${theme}.jpg`;
      const image = await get(path);
      assert.match(image.headers.get('content-type'), /^image\/jpeg/, path);
      const bytes = new Uint8Array(await image.arrayBuffer());
      assert.ok(bytes.length > 10000, path + ' is a real screenshot');
      assert.equal(bytes[0], 0xff, path + ' JPEG signature');
      assert.equal(bytes[1], 0xd8, path + ' JPEG signature');
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      let dimensions;
      for (let offset = 2; offset + 8 < bytes.length; ) {
        assert.equal(bytes[offset], 0xff, path + ' JPEG marker');
        const marker = bytes[offset + 1];
        if ([0xc0, 0xc1, 0xc2].includes(marker)) {
          dimensions = [view.getUint16(offset + 7), view.getUint16(offset + 5)];
          break;
        }
        const length = view.getUint16(offset + 2);
        assert.ok(length >= 2, path + ' JPEG segment');
        offset += length + 2;
      }
      const expected = screenshotDimensions[name];
      assert.ok(expected, path + ' screenshot metadata');
      assert.deepEqual(
        dimensions,
        [expected.width, expected.height],
        path + ' screenshot dimensions',
      );
    }
  }
  assert.equal(
    optimizedScreenshots.size,
    screenshotNames.size * 2,
    'Every screenshot has both optimized themes',
  );
  for (const src of optimizedScreenshots) {
    const image = await get(src);
    assert.match(image.headers.get('content-type'), /^image\//, src);
    assert.ok((await image.arrayBuffer()).byteLength > 1000, src);
  }
  const defaultLocale = await fetch(base + '/docs/backups?check=1', {
    redirect: 'manual',
  });
  assert.equal(defaultLocale.status, 308);
  assert.equal(
    new URL(defaultLocale.headers.get('location'), base).pathname,
    '/nl/docs/backups',
  );
  assert.equal(
    new URL(defaultLocale.headers.get('location'), base).search,
    '?check=1',
  );
  await get('/it/docs', 404);
  for (const path of [
    '/brand/logo-light.png',
    '/brand/logo-dark.png',
    '/icon.png',
    '/_next/image?url=%2Fbrand%2Flogo-light.png&w=256&q=75',
  ]) {
    const response = await get(path);
    assert.match(response.headers.get('content-type'), /^image\//);
    await response.arrayBuffer();
  }
  assert.match(await (await get('/llms.txt')).text(), /\/en\/docs/);
  assert.match(
    await (await get('/robots.txt')).text(),
    /https:\/\/docs.vecloud.eu\/sitemap.xml/,
  );
  console.log(
    JSON.stringify({
      target: server ? 'standalone' : base,
      pages: pages.length,
      locales: counts,
      layout: 'notebook',
      search: 'passed',
      markdown: 'passed',
      alternates: 'passed',
      redirects: 'passed',
      images: 'passed',
      screenshotPairs: screenshotNames.size,
      optimizedScreenshots: optimizedScreenshots.size,
      internalLinks: internalLinks.size,
      notFound: 'passed',
    }),
  );
} finally {
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    const timer = setTimeout(() => server.kill('SIGKILL'), 3000);
    await exited;
    clearTimeout(timer);
  }
}
