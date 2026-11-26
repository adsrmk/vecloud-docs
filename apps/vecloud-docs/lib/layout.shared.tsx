import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="docs-brand">
          <Image
            src="/brand/logo-light.png"
            width={124}
            height={28}
            alt="veCloud"
            className="dark:hidden"
            priority
          />
          <Image
            src="/brand/logo-dark.png"
            width={124}
            height={28}
            alt="veCloud"
            className="hidden dark:block"
            priority
          />
          <span className="docs-brand-label">Docs</span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: 'Documentatie', url: '/docs', active: 'nested-url' },
      {
        type: 'button',
        text: 'Control Panel',
        url: 'https://panel.vecloud.eu',
        external: true,
        icon: <ArrowUpRight className="size-4" aria-hidden />,
      },
    ],
  };
}
