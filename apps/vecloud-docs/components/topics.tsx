import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { messages } from '@/lib/translations';
import type { Locale } from '@/lib/i18n';
import { getDocsUrl } from '@/lib/shared';
import { Card, Cards } from 'fumadocs-ui/components/card';
import {
  Globe,
  Blocks,
  Mail,
  Archive,
  LockKeyhole,
  FolderOpen,
  Users,
  Package,
  Database,
  Gauge,
  Code,
  LifeBuoy,
} from 'lucide-react';

const topics = [
  {
    slug: 'account',
    path: ['account', 'navigation'],
    icon: <Users aria-hidden />,
  },
  { slug: 'websites', icon: <Globe aria-hidden /> },
  { slug: 'applications', icon: <Package aria-hidden /> },
  { slug: 'wordpress', icon: <Blocks aria-hidden /> },
  { slug: 'email', icon: <Mail aria-hidden /> },
  { slug: 'backups', icon: <Archive aria-hidden /> },
  { slug: 'dns-ssl', icon: <LockKeyhole aria-hidden /> },
  { slug: 'files', icon: <FolderOpen aria-hidden /> },
  { slug: 'databases', icon: <Database aria-hidden /> },
  { slug: 'performance', icon: <Gauge aria-hidden /> },
  {
    slug: 'developers',
    path: ['developers', 'php'],
    icon: <Code aria-hidden />,
  },
  { slug: 'help', icon: <LifeBuoy aria-hidden /> },
] as const;

export function Topics({ locale }: { locale: Locale }) {
  return (
    <Cards>
      {topics.map((topic) => {
        const text = messages[locale].topics[topic.slug];
        return (
          <Card
            key={topic.slug}
            title={text.title}
            href={getDocsUrl(
              'path' in topic ? [...topic.path] : [topic.slug],
              locale,
            )}
            icon={topic.icon}
          >
            {text.description}
          </Card>
        );
      })}
    </Cards>
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
