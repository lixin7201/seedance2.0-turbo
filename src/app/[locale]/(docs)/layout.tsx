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
const ja: Partial<Translations> = {
  search: 'コンテンツを検索',
};
const nl: Partial<Translations> = {
  search: 'Inhoud zoeken',
};
const pl: Partial<Translations> = {
  search: 'Szukaj treści',
};
const ru: Partial<Translations> = {
  search: 'Поиск контента',
};
const ko: Partial<Translations> = {
  search: '콘텐츠 검색',
};
const it: Partial<Translations> = {
  search: 'Cerca contenuto',
};
const tr: Partial<Translations> = {
  search: 'İçerik ara',
};
// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '日本語',
    locale: 'ja',
  },
  {
    name: 'Deutsch',
    locale: 'de',
  },
  {
    name: 'Français',
    locale: 'fr',
  },
  {
    name: '한국어',
    locale: 'ko',
  },
  {
    name: '中文',
    locale: 'zh',
  },
  {
    name: 'Español',
    locale: 'es',
  },
  {
    name: 'Italiano',
    locale: 'it',
  },
  {
    name: 'Portuguese',
    locale: 'pt',
  },
  {
    name: 'Türkçe',
    locale: 'tr',
  },
  {
    name: 'العربية',
    locale: 'ar',
  },
  {
    name: 'Русский',
    locale: 'ru',
  },
  {
    name: 'Polski',
    locale: 'pl',
  },
  {
    name: 'Nederlands',
    locale: 'nl',
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
        translations: { zh, es, ar, pt, fr, de, ja, nl, pl, ru, ko, it, tr }[lang],
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
