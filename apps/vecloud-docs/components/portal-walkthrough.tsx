'use client';

import { useEffect, useId, useRef } from 'react';
import type { Locale } from '@/lib/i18n';
import walkthroughs from '@/lib/walkthroughs.json';

export function PortalWalkthrough({
  name,
  alt,
  caption,
  locale,
}: {
  name: keyof typeof walkthroughs;
  alt: string;
  caption: string;
  locale: Locale;
}) {
  const figure = useRef<HTMLElement>(null);
  const descriptionId = useId();
  const media = walkthroughs[name];

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const pauseHiddenVideo = () => {
      for (const video of element.querySelectorAll('video')) {
        if (getComputedStyle(video).display === 'none') video.pause();
      }
    };
    const observer = new MutationObserver(pauseHiddenVideo);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => {
      observer.disconnect();
      for (const video of element.querySelectorAll('video')) video.pause();
    };
  }, []);

  return (
    <figure className="portal-walkthrough not-prose" ref={figure}>
      {(['light', 'dark'] as const).map((theme) => (
        <video
          key={theme}
          className={theme === 'light' ? 'block dark:hidden' : 'hidden dark:block'}
          src={`/walkthroughs/${name}-${theme}.mp4`}
          poster={`/screenshots/${media.poster}-${theme}.jpg?v=20261127-1`}
          width={media.width}
          height={media.height}
          aria-label={alt}
          aria-describedby={descriptionId}
          controls
          playsInline
          preload="none"
        >
          <track
            kind="captions"
            src={`/walkthroughs/${name}-${locale}.vtt`}
            srcLang={locale}
            label={locale.toUpperCase()}
          />
        </video>
      ))}
      <figcaption id={descriptionId}>{caption}</figcaption>
    </figure>
  );
}
