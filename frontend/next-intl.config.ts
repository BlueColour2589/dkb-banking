import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'de'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // If invalid, default to 'en' instead of using notFound()
  const validLocale = locales.includes(locale as any) ? locale : 'en';

  return {
    locale: validLocale,
    messages: (await import(`./locales/${validLocale}/common.json`)).default
  };
});