import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { messages } from '@/lib/translations';
import type { Locale } from '@/lib/i18n';
import { getDocsUrl } from '@/lib/shared';

type Topic = keyof (typeof messages)['en']['topics'];

const guidePaths: Partial<Record<Topic, string[]>> = {
  account: ['account', 'navigation'],
  developers: ['developers', 'php'],
};

const topicGroups = [
  {
    id: 'hosting',
    topics: ['websites', 'applications', 'wordpress', 'email'],
  },
  {
    id: 'management',
    topics: [
      'backups', 'dns-ssl', 'files', 'databases', 'performance', 'developers',
    ],
  },
  { id: 'support', topics: ['account', 'help'] },
] as const satisfies ReadonlyArray<{
  id: keyof (typeof messages)['en']['topicGroups'];
  topics: readonly Topic[];
}>;

export function Topics({ locale }: { locale: Locale }) {
  const text = messages[locale];

  return (
    <div className="docs-topics not-prose">
      {topicGroups.map((group) => (
        <section key={group.id} className="docs-topic-group">
          <h3 className="docs-topic-group-title">
            {text.topicGroups[group.id]}
          </h3>
          <ul role="list" className="docs-topic-list">
            {group.topics.map((slug) => {
              const topic = text.topics[slug];
              return (
                <li key={slug}>
                  <Link
                    href={getDocsUrl(guidePaths[slug] ?? [slug], locale)}
                    prefetch={false}
                    className="docs-topic-link"
                  >
                    <span className="docs-topic-copy">
                      <span className="docs-topic-title">{topic.title}</span>
                      <span className="docs-topic-description">
                        {topic.description}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function DocsActions({ locale }: { locale: Locale }) {
  const text = messages[locale];
  return (
    <div className="docs-actions not-prose">
      <Link
        href={getDocsUrl(['snelstart'], locale)}
        className={buttonVariants({
          variant: 'primary',
          className: 'docs-action',
        })}
      >
        {text.getStarted}
      </Link>
      <a
        href="https://panel.vecloud.eu"
        className={buttonVariants({
          variant: 'outline',
          className: 'docs-action',
        })}
      >
        {text.openPanel} <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  );
}
