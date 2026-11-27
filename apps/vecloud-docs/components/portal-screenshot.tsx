import Image from 'next/image';
import screenshotDimensions from '@/lib/screenshot-dimensions.json';

const screenshotRevision = '20261127-2';
const dimensions: Record<string, { width: number; height: number; density?: number }> =
  screenshotDimensions;

export function PortalScreenshot({
  name,
  alt,
  caption,
}: {
  name: string;
  alt: string;
  caption: string;
}) {
  const { width, height, density = 1 } = dimensions[name];
  const displayWidth = Math.min(Math.round(width / density), 900);
  return (
    <figure
      className="portal-screenshot not-prose mx-auto grid w-full"
      style={{ maxWidth: displayWidth }}
    >
      {(['light', 'dark'] as const).map((theme) => (
        <a
          key={theme}
          href={`/screenshots/${name}-${theme}.jpg?v=${screenshotRevision}`}
          className={
            theme === 'light'
              ? 'col-start-1 row-start-1 block dark:hidden'
              : 'col-start-1 row-start-1 hidden dark:block'
          }
          target="_blank"
          rel="noreferrer"
          aria-label={alt}
        >
          <Image
            src={`/screenshots/${name}-${theme}.jpg?v=${screenshotRevision}`}
            alt={alt}
            width={width}
            height={height}
            quality={92}
            sizes={`auto, (max-width: 767px) calc(100vw - 32px), ${displayWidth}px`}
          />
        </a>
      ))}
      <figcaption className="col-start-1 row-start-2">{caption}</figcaption>
    </figure>
  );
}
