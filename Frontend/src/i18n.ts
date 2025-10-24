import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import viCommon from './locales/vi/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  vi: {
    common: viCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    detection: { 
      order: ['localStorage', 'navigator'], 
      caches: ['localStorage'],
      lookupLocalStorage: 'lang'
    },
    interpolation: { 
      escapeValue: false,
      formatSeparator: ',',
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      }
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;


