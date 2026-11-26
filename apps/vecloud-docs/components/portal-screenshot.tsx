import Image from 'next/image';

export function PortalScreenshot({
  name,
  alt,
  caption,
}: {
  name: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="portal-screenshot not-prose grid">
      {(['light', 'dark'] as const).map((theme) => (
        <a
          key={theme}
          href={`/screenshots/${name}-${theme}.jpg`}
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
            src={`/screenshots/${name}-${theme}.jpg`}
            alt={alt}
            width={1280}
            height={900}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </a>
      ))}
      <figcaption className="col-start-1 row-start-2">{caption}</figcaption>
    </figure>
  );
}
