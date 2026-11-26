import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Topics } from '@/components/topics';

export default function HomePage() {
  return (
    <main className="docs-home">
      <section className="docs-hero">
        <div className="docs-eyebrow">
          <BookOpen className="size-4" aria-hidden /> veCloud Control Panel
        </div>
        <h1>
          Een goede start.
          <br />
          <span>Alles onder controle.</span>
        </h1>
        <p>
          Van je eerste website tot een herstel uit je back-up. Vind de uitleg
          die je nodig hebt om je hosting zelf te beheren.
        </p>
        <div className="docs-hero-actions">
          <Link
            href="/docs/snelstart"
            className={buttonVariants({
              variant: 'primary',
              className: 'docs-action',
            })}
          >
            Aan de slag <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/docs"
            className={buttonVariants({
              variant: 'outline',
              className: 'docs-action',
            })}
          >
            Bekijk de documentatie
          </Link>
        </div>
      </section>
      <section className="docs-topics" aria-labelledby="topics-title">
        <div className="docs-section-heading">
          <h2 id="topics-title">Waar wil je mee aan de slag?</h2>
          <p>Kies een onderwerp en vind je weg in het Control Panel.</p>
        </div>
        <Topics />
      </section>
      <section className="docs-panel-link">
        <div>
          <h2>Klaar om aan de slag te gaan?</h2>
          <p>Open het Control Panel en houd de handleiding erbij.</p>
        </div>
        <a
          href="https://panel.vecloud.eu"
          className={buttonVariants({
            variant: 'outline',
            className: 'docs-action',
          })}
        >
          Open Control Panel <ExternalLink className="size-4" aria-hidden />
        </a>
      </section>
      <footer className="docs-footer">
        <span>veCloud · Documentatie</span>
        <a
          href="https://fumadocs.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gebouwd met Fumadocs
        </a>
      </footer>
    </main>
  );
}
