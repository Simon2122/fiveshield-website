// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// HttpApi is removed as it's not needed when all languages are embedded

// Import the JSON files for the languages you are embedding
import enTranslation from '../public/locales/en/translation.json';
import frTranslation from '../public/locales/fr/translation.json';

i18n
  // HttpApi usage is removed
  .use(LanguageDetector) // Still needed for detecting user language preference
  .use(initReactI18next) // Still needed for React integration
  .init({
    // Provide resources directly
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },

    supportedLngs: ['en', 'fr'], // Define supported languages
    fallbackLng: 'en', // Language to use if detection fails or language isn't available
    ns: ['translation'], // Define your namespaces
    defaultNS: 'translation', // Default namespace

    // Keep logs off (or use process.env.NODE_ENV === 'development' for dev only)
    debug: false,

    // React specific settings
    react: {
      useSuspense: true, // Recommended for cleaner loading states
      transSupportBasicHtmlNodes: true, // Allow basic HTML in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'], // Specify allowed tags
    },

    // Language detection settings
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'], // Order of detection methods
      caches: ['cookie', 'localStorage'], // Where to cache the detected language
      cookieOptions: { path: '/', sameSite: 'strict' } // Options for the cookie cache
    },

    // Interpolation settings (defaults are usually fine)
    interpolation: {
      escapeValue: false, // React already escapes values, so this is safe
    },

    // The 'backend' configuration block is removed as HttpApi is not used
  });

export default i18n;