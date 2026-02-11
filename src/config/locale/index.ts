import { envConfigs } from '..';

export const localeNames: any = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ar: 'العربية',
  pt: 'Portuguese',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
};

export const locales = ['en', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'nl', 'pl', 'ru'];

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
