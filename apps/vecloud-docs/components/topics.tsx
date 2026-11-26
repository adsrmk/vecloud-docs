import { Card, Cards } from 'fumadocs-ui/components/card';
import {
  Globe2,
  Blocks,
  Mail,
  Archive,
  LockKeyhole,
  FolderOpen,
} from 'lucide-react';

const topics = [
  {
    title: 'Websites & domeinen',
    href: '/docs/websites',
    icon: <Globe2 aria-hidden />,
    description: 'Voeg je domein toe en vind de instellingen van je website.',
  },
  {
    title: 'WordPress',
    href: '/docs/wordpress',
    icon: <Blocks aria-hidden />,
    description: 'Installeer WordPress en beheer plugins, thema’s en updates.',
  },
  {
    title: 'E-mail',
    href: '/docs/email',
    icon: <Mail aria-hidden />,
    description: 'Beheer mailboxen, doorsturen en je spaminstellingen.',
  },
  {
    title: 'Back-ups & herstel',
    href: '/docs/backups',
    icon: <Archive aria-hidden />,
    description: 'Bekijk je back-ups en herstel bestanden of databases.',
  },
  {
    title: 'DNS & SSL',
    href: '/docs/dns-ssl',
    icon: <LockKeyhole aria-hidden />,
    description: 'Stel DNS-records in en beveilig je website met HTTPS.',
  },
  {
    title: 'Bestanden & databases',
    href: '/docs/bestanden-databases',
    icon: <FolderOpen aria-hidden />,
    description: 'Werk met bestanden, databasegebruikers en phpMyAdmin.',
  },
];

export function Topics() {
  return (
    <Cards>
      {topics.map((topic) => (
        <Card
          key={topic.href}
          title={topic.title}
          href={topic.href}
          icon={topic.icon}
        >
          {topic.description}
        </Card>
      ))}
    </Cards>
  );
}
