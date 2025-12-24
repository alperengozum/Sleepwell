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

export const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'az', 'uz', 'hi', 'ur', 'ar', 'es', 'ru'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  fr: 'Français',
  az: 'Azərbaycan dili',
  uz: 'O\'zbek tili',
  hi: 'हिंदी',
  ur: 'اردو',
  ar: 'العربية',
  es: 'Español',
  ru: 'Русский',
};

export const getLanguageLabel = (code: string): string => {
  return isValidLanguage(code) ? LANGUAGE_LABELS[code] : LANGUAGE_LABELS.en;
};

export const getLanguagesList = (): Array<{ code: SupportedLanguage; label: string }> => {
  return SUPPORTED_LANGUAGES.map(code => ({
    code,
    label: LANGUAGE_LABELS[code],
  }));
};

const getInitialLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await getItem('language');
    if (savedLanguage && isValidLanguage(savedLanguage)) {
      return savedLanguage;
    }

    const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
    if (isValidLanguage(deviceLocale)) {
      return deviceLocale;
    }
    return 'en';
  } catch (error) {
    console.error('Error getting initial language:', error);
    return 'en';
  }
};

// Initialize i18n asynchronously to avoid race conditions
export const initializeI18n = async (): Promise<void> => {
  // Check if i18n is already initialized to prevent multiple initialization errors
  if (i18n.isInitialized) {
    return;
  }
  
  const initialLanguage = await getInitialLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Listen to language changes from store
export const syncLanguageWithStore = (language: string) => {
  if (isValidLanguage(language)) {
    i18n.changeLanguage(language);
  }
};

export default i18n;

