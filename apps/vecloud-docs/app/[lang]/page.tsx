import { redirect, notFound } from 'next/navigation';
import { getDocsUrl } from '@/lib/shared';
import { isLocale } from '@/lib/i18n';

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(getDocsUrl([], lang));
}
