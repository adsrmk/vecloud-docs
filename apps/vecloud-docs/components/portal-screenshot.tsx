import Image from 'next/image';
import screenshotDimensions from '@/lib/screenshot-dimensions.json';

const screenshotRevision = '20261126-3';
const dimensions: Record<string, { width: number; height: number }> =
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
  const { width, height } = dimensions[name];
  return (
    <figure className="portal-screenshot not-prose grid">
      {(['light', 'dark'] as const).map((theme) => (
        <a
          key={theme}
          href={`/screenshots/${name}-${theme}.jpg?v=${screenshotRevision}`}
          className={
            theme === 'light'
              ? 'col-start-1 row-start-1 visible dark:invisible'
              : 'invisible col-start-1 row-start-1 dark:visible'
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
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </a>
      ))}
      <figcaption className="col-start-1 row-start-2">{caption}</figcaption>
    </figure>
  );
}
