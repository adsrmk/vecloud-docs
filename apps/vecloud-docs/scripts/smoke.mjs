import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const app = new URL('../', import.meta.url);
const standalone = new URL('.next/standalone/', app);
await mkdir(new URL('.next/', standalone), { recursive: true });
await cp(new URL('public/', app), new URL('public/', standalone), {
  recursive: true,
});
await cp(new URL('.next/static/', app), new URL('.next/static/', standalone), {
  recursive: true,
});
const reserve = createServer();
reserve.listen(0, '127.0.0.1');
await once(reserve, 'listening');
const port = reserve.address().port;
await new Promise((resolve) => reserve.close(resolve));
const base = `http://127.0.0.1:${port}`;
const server = spawn(
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
let output = '';
for (const stream of [server.stdout, server.stderr])
  stream.on('data', (value) => {
    output = (output + value).slice(-4000);
  });
async function get(path, expected = 200, headers = {}) {
  const response = await fetch(base + path, {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(response.status, expected, path);
  return response;
}
try {
  const deadline = Date.now() + 20000;
  while (true) {
    if (server.exitCode !== null) throw new Error(output);
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
    if (Date.now() > deadline)
      throw new Error('Standalone readiness failed: ' + output);
    await delay(100);
  }
  const sitemap = await (await get('/sitemap.xml')).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)];
  assert.ok(pages.length >= 9);
  for (const [, url] of pages) {
    assert.equal(new URL(url).hostname, 'docs.vecloud.eu');
    const html = await (await get(new URL(url).pathname)).text();
    assert.match(html, /<html[^>]+lang="nl"/);
    assert.ok(!html.includes('Hello World'));
  }
  const search = await (await get('/api/search?query=herstellen')).json();
  assert.ok(search.some((result) => result.url.startsWith('/docs/backups')));
  const markdown = await (await get('/docs/backups.md')).text();
  assert.match(markdown, /Back-ups & herstel/);
  assert.ok(!markdown.includes('<!DOCTYPE html>'));
  await get('/docs/deze-pagina-bestaat-niet', 404);
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
  console.log(
    JSON.stringify({
      standalone: 'passed',
      pages: pages.length,
      search: 'passed',
      markdown: 'passed',
      notFound: 'passed',
      images: 'passed',
    }),
  );
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    const timer = setTimeout(() => server.kill('SIGKILL'), 3000);
    await exited;
    clearTimeout(timer);
  }
}
