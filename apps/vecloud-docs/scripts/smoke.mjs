import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

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
  assert.equal(pages.length, 40, 'Eight guides in each of five languages');
  const counts = Object.fromEntries(locales.map((locale) => [locale, 0]));
  for (const [, url] of pages) {
    const location = new URL(url);
    assert.equal(location.origin, 'https://docs.vecloud.eu');
    const path = location.pathname;
    const locale = path.match(/^\/(nl|en|es|fr|de)(?:\/|$)/)?.[1] ?? 'nl';
    const slug = path.slice((prefix(locale) + '/docs').length + 1) || 'index';
    const filename = `content/docs/${slug}${locale === 'nl' ? '' : '.' + locale}.mdx`;
    const mdx = await readFile(new URL(filename, app), 'utf8');
    const title = mdx.match(/^title: (.+)$/m)[1];
    const html = await (await get(path)).text();
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
    counts[locale]++;
  }
  const queries = {
    nl: 'herstellen',
    en: 'restore',
    es: 'restauración',
    fr: 'restauration',
    de: 'Wiederherstellung',
  };
  for (const locale of locales) {
    assert.equal(counts[locale], 8, locale);
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
