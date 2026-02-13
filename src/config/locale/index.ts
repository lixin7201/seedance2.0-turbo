import { envConfigs } from '..';

export const localeNames: any = {
  en: 'English',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  ko: '한국어',
  zh: '中文',
  es: 'Español',
  it: 'Italiano',
  pt: 'Portuguese',
  tr: 'Türkçe',
  ar: 'العربية',
  ru: 'Русский',
  pl: 'Polski',
  nl: 'Nederlands',
};

export const locales = ['en', 'ja', 'de', 'fr', 'ko', 'zh', 'es', 'it', 'pt', 'tr', 'ar', 'ru', 'pl', 'nl'];

export const defaultLocale = envConfigs.locale;

export const localePrefix = 'as-needed';

export const localeDetection = false;

export const localeMessagesRootPath = '@/config/locale/messages';

export const localeMessagesPaths = [
  'common',
  'landing',
  'blog',
  'updates',
  'pricing',
  'settings/sidebar',
  'settings/profile',
  'settings/security',
  'settings/billing',
  'settings/payments',
  'settings/credits',
  'settings/apikeys',
  'admin/sidebar',
  'admin/users',
  'admin/roles',
  'admin/permissions',
  'admin/categories',
  'admin/posts',
  'admin/payments',
  'admin/subscriptions',
  'admin/credits',
  'admin/settings',
  'admin/apikeys',
  'admin/ai-tasks',
  'admin/chats',
  'ai/music',
  'ai/chat',
  'ai/image',
  'ai/video',
  'activity/sidebar',
  'activity/ai-tasks',
  'activity/chats',
  'pages/index',
  'pages/pricing',
  'pages/blog',
  'pages/updates',
  'pages/features/text-to-video',
  'pages/features/image-to-video',
  'pages/payment_success',
  'pages/about',
];
