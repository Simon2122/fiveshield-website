// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import the JSON files for the languages you are embedding
import enTranslation from '../public/locales/en/translation.json';
import frTranslation from '../public/locales/fr/translation.json';

// Define resources once to avoid repeated object creation
const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
};

// Cache initialization to prevent duplicate initialization
let initialized = false;

const initI18n = () => {
  if (initialized) return;
  
  let i18nChain = i18n;

  // Only add the LanguageDetector middleware on the client side
  if (typeof window !== 'undefined') {
    i18nChain = i18nChain.use(LanguageDetector);
  }

  i18nChain
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: ['en', 'fr'],
      fallbackLng: 'en',
      ns: ['translation'],
      defaultNS: 'translation',
      
      // Keep logs off
      debug: process.env.NODE_ENV === 'development',

      // React specific settings
      react: {
        useSuspense: true,
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'],
      },

      // Detection options are only relevant if LanguageDetector is used (client-side)
      detection: {
        order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
        cookieOptions: { path: '/', sameSite: 'strict', secure: process.env.NODE_ENV === 'production' }
      },

      interpolation: {
        escapeValue: false,
      },
    });
  
  initialized = true;
};

export default i18n;
export { initI18n, resources };