import {create} from "zustand";
import {getItem, setItem} from "../utils/AsyncStorageUtils";

export enum SettingsType {
  FALL_ASLEEP = "Fall Asleep",
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
  getSettings: (type?: SettingsType) => Array<Settings> | undefined;
  setSettings: (settings: Array<Settings> | undefined) => void;
  addSetting: (setting: Settings) => void;
  editSetting: (type: SettingsType, value: string | number | boolean | undefined) => void;
  getSettingsAsync: (type?: SettingsType) => Promise<Array<Settings> | undefined>;
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

  initialize: async () => {
    const settings = await getItem("settings");
    const processedSettings = settings || getInitialSettings();
    set({ settings: processedSettings, loading: false });
    await setItem("settings", processedSettings);
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
}));

// Initialize store on import
useSettingsStore.getState().initialize();
