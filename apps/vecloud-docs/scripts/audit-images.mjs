import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = new URL('../public/screenshots/', import.meta.url);
const dimensions = JSON.parse(
  await readFile(
    new URL('../lib/screenshot-dimensions.json', import.meta.url),
    'utf8',
  ),
);
const expectedFiles = new Set();
for (const [name, size] of Object.entries(dimensions)) {
  const pair = {};
  for (const theme of ['light', 'dark']) {
    const filename = `${name}-${theme}.jpg`;
    expectedFiles.add(filename);
    const { data, info } = await sharp(new URL(filename, root).pathname)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.deepEqual(
      [info.width, info.height],
      [size.width, size.height],
      filename,
    );
    let sum = 0;
    let count = 0;
    let rightSum = 0;
    let rightSquare = 0;
    let rightCount = 0;
    for (let y = 0; y < info.height; y += 3) {
      for (let x = 0; x < info.width; x += 3) {
        const offset = (y * info.width + x) * info.channels;
        const value = (data[offset] + data[offset + 1] + data[offset + 2]) / 3;
        if (
          x >= info.width * 0.25 && x < info.width * 0.97 &&
          y >= info.height * 0.12 && y < info.height * 0.85
        ) {
          sum += value;
          count++;
        }
        if (x >= info.width / 2) {
          rightSum += value;
          rightSquare += value * value;
          rightCount++;
        }
      }
    }
    const variation = Math.sqrt(
      Math.max(0, rightSquare / rightCount - (rightSum / rightCount) ** 2),
    );
    assert.ok(variation > 1.5, filename + ' has content across the canvas');
    pair[theme] = sum / count;
  }
  // The portal's code editor deliberately uses a dark canvas in both themes.
  const darkEditor = name === 'file-editor';
  assert.ok(pair.light > (darkEditor ? 50 : 150), name + ' light screenshot');
  assert.ok(pair.dark < 100, name + ' dark screenshot');
  assert.ok(
    pair.light - pair.dark > (darkEditor ? 20 : 60),
    name + ' distinct themes',
  );
}
const actualFiles = (await readdir(root)).filter((name) => name.endsWith('.jpg'));
assert.deepEqual(new Set(actualFiles), expectedFiles, 'Screenshot manifest coverage');
console.log(JSON.stringify({
  screenshots: actualFiles.length,
  themes: 'passed',
  layout: 'passed',
  dimensions: 'passed',
}));
