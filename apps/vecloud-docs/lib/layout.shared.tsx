import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getDocsUrl } from './shared';
import { i18n, type Locale } from './i18n';
import { ui } from './translations';
import { uiTranslations } from 'fumadocs-ui/i18n';

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
          <span className="docs-brand-logo" role="img" aria-label="veCloud" />
          <span className="docs-brand-label">Docs</span>
        </span>
      ),
    },
  };
}
