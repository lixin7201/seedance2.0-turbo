import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { RootProvider } from 'fumadocs-ui/provider';

import { source } from '@/core/docs/source';

import { baseOptions } from './layout.config';

import '@/config/style/docs.css';

const zh: Partial<Translations> = {
  search: '搜索内容',
};
const es: Partial<Translations> = {
  search: 'Buscar contenido',
};
const ar: Partial<Translations> = {
  search: 'البحث عن محتوى',
};
const pt: Partial<Translations> = {
  search: 'Pesquisar conteúdo',
};
const fr: Partial<Translations> = {
  search: 'Rechercher du contenu',
};
const de: Partial<Translations> = {
  search: 'Inhalt suchen',
};
// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '简体中文',
    locale: 'zh',
  },
  {
    name: 'Español',
    locale: 'es',
  },
  {
    name: 'العربية',
    locale: 'ar',
  },
  {
    name: 'Portuguese',
    locale: 'pt',
  },
  {
    name: 'Français',
    locale: 'fr',
  },
  {
    name: 'Deutsch',
    locale: 'de',
  },
];

export default async function DocsRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale || 'en';

  return (
    <RootProvider
      i18n={{
        locale: lang,
        locales,
        translations: { zh, es, ar, pt, fr, de }[lang],
      }}
      search={{
        options: {
          api: '/api/docs/search',
        },
      }}
    >
      <DocsLayout
        {...baseOptions(lang)}
        tree={source.pageTree[lang]}
        nav={{ ...baseOptions(lang).nav, mode: 'top' }}
        sidebar={{
          tabs: [],
        }}
        tabMode="sidebar"
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
