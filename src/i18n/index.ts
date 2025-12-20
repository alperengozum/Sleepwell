import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getItem } from '../utils/AsyncStorageUtils';

import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import az from './locales/az.json';
import uz from './locales/uz.json';
import hi from './locales/hi.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import es from './locales/es.json';
import ru from './locales/ru.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
  de: {
    translation: de,
  },
  fr: {
    translation: fr,
  },
  az: {
    translation: az,
  },
  uz: {
    translation: uz,
  },
  hi: {
    translation: hi,
  },
  ur: {
    translation: ur,
  },
  ar: {
    translation: ar,
  },
  es: {
    translation: es,
  },
  ru: {
    translation: ru,
  },
};

const getInitialLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr' || savedLanguage === 'de' || savedLanguage === 'fr' || savedLanguage === 'az' || savedLanguage === 'uz' || savedLanguage === 'hi' || savedLanguage === 'ur' || savedLanguage === 'ar' || savedLanguage === 'es' || savedLanguage === 'ru')) {
      return savedLanguage;
    }
    // Get device locale
    const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
    if (deviceLocale === 'tr') return 'tr';
    if (deviceLocale === 'de') return 'de';
    if (deviceLocale === 'fr') return 'fr';
    if (deviceLocale === 'az') return 'az';
    if (deviceLocale === 'uz') return 'uz';
    if (deviceLocale === 'hi') return 'hi';
    if (deviceLocale === 'ur') return 'ur';
    if (deviceLocale === 'ar') return 'ar';
    if (deviceLocale === 'es') return 'es';
    if (deviceLocale === 'ru') return 'ru';
    return 'en';
  } catch (error) {
    console.error('Error getting initial language:', error);
    return 'en';
  }
};

// Initialize i18n synchronously with default, then update when async call completes
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default, will be updated
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

// Update language after async call
getInitialLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

// Listen to language changes from store
export const syncLanguageWithStore = (language: string) => {
  if (language === 'en' || language === 'tr' || language === 'de' || language === 'fr' || language === 'az' || language === 'uz' || language === 'hi' || language === 'ur' || language === 'ar' || language === 'es' || language === 'ru') {
    i18n.changeLanguage(language);
  }
};

export default i18n;

