import {create} from "zustand";
import {getItem, setItem} from "../utils/AsyncStorageUtils";
import {syncLanguageWithStore, isValidLanguage} from "../i18n";
import * as Localization from 'expo-localization';

export enum SettingsType {
  FALL_ASLEEP = "Fall Asleep",
  LANGUAGE = "Language",
  WELCOME = "Welcome",
}

export interface Settings {
  type: SettingsType
  value: string | number | boolean | undefined,
  id?: number
}

interface SettingsStore {
  settings: Array<Settings> | undefined;
  loading: boolean;
  language: string;
  getSettings: (type?: SettingsType) => Array<Settings> | undefined;
  setSettings: (settings: Array<Settings> | undefined) => Promise<void>;
  addSetting: (setting: Settings) => Promise<void>;
  editSetting: (type: SettingsType, value: string | number | boolean | undefined) => Promise<void>;
  getSettingsAsync: (type?: SettingsType) => Promise<Array<Settings> | undefined>;
  setLanguage: (language: string) => Promise<void>;
  initialize: () => Promise<void>;
}

const getInitialSettings = (): Settings[] => {
  const settings: Settings[] = (Object.keys(SettingsType) as Array<keyof typeof SettingsType>).map((key, i) => {
    return {
      type: SettingsType[key],
      value: undefined,
      id: i
    }
  })
  return settings;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: undefined,
  loading: true,
  language: 'en',

  initialize: async () => {
    try {
      const settings = await getItem("settings");
      let processedSettings = settings || getInitialSettings();
      
      // Ensure all SettingsType enum values are present
      const allSettingsTypes = Object.values(SettingsType);
      const existingTypes = processedSettings.map((s: Settings) => s.type);
      const missingTypes = allSettingsTypes.filter(type => !existingTypes.includes(type));
      
      // Add missing settings
      if (missingTypes.length > 0) {
        missingTypes.forEach((type, index) => {
          processedSettings.push({
            type,
            value: undefined,
            id: processedSettings.length + index
          });
        });
      }
      
      // Initialize language
      const savedLanguage = await getItem("language");
      let initialLanguage: string;
      
      if (savedLanguage && isValidLanguage(savedLanguage)) {
        initialLanguage = savedLanguage;
      } else {
        // First time opening - detect device language
        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        initialLanguage = isValidLanguage(deviceLocale) ? deviceLocale : 'en';
      }
      
      set({ settings: processedSettings, loading: false, language: initialLanguage });
      syncLanguageWithStore(initialLanguage);
      try {
        await setItem("settings", processedSettings);
        await setItem("language", initialLanguage);
      } catch (persistError) {
        console.error("Failed to persist settings during initialization:", persistError);
      }
    } catch (error) {
      console.error("Failed to initialize settings store:", error);
      const fallbackSettings = getInitialSettings();
      set({ settings: fallbackSettings, loading: false, language: 'en' });
      syncLanguageWithStore('en');
      try {
        await setItem("settings", fallbackSettings);
        await setItem("language", 'en');
      } catch (persistError) {
        console.error("Failed to persist fallback settings during initialization:", persistError);
      }
    }
  },

  getSettings: (type?: SettingsType) => {
    const { settings } = get();
    if (!settings) {
      return undefined;
    }
    if (type) {
      return settings.filter((setting) => setting.type == type);
    }
    return settings;
  },

  setSettings: async (settings: Array<Settings> | undefined) => {
    const processedSettings = settings || getInitialSettings();
    set({ settings: processedSettings });
    await setItem("settings", processedSettings);
  },

  addSetting: async (setting: Settings) => {
    const { settings } = get();
    let newSettings = settings || [];
    
    if (!setting.id) {
      setting.id = newSettings.length || Math.random() * 1000;
    }
    newSettings = [...newSettings, setting];
    
    set({ settings: newSettings });
    await setItem("settings", newSettings);
  },

  editSetting: async (type: SettingsType, value: string | number | boolean | undefined) => {
    const { settings } = get();
    if (!settings) return;
    
    const updatedSettings = settings.map((s) => {
      if (s.type == type) {
        return { ...s, value };
      }
      return s;
    });
    
    set({ settings: updatedSettings });
    await setItem("settings", updatedSettings);
  },

  getSettingsAsync: async (type?: SettingsType) => {
    const { loading, getSettings } = get();
    while (loading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return getSettings(type);
  },

  setLanguage: async (language: string) => {
    if (!isValidLanguage(language)) {
      console.error('Invalid language:', language);
      return;
    }
    set({ language });
    await setItem("language", language);
    syncLanguageWithStore(language);
  },
}));

// Initialize store when explicitly requested (e.g., from app startup)
export const initializeSettingsStore = () => {
  return useSettingsStore.getState().initialize();
};
