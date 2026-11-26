import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getDocsUrl } from './shared';
import { i18n, type Locale } from './i18n';
import { ui } from './translations';
import { uiTranslations } from 'fumadocs-ui/i18n';
import Image from 'next/image';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add(ui);

export function baseOptions(locale: Locale): BaseLayoutProps {
  return {
    nav: {
      url: getDocsUrl([], locale),
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
  };
}
