import {action, makeAutoObservable} from "mobx";
import {getItem, setItem} from "../utils/AsyncStorageUtils";

export enum SettingsType {
  FALL_ASLEEP = "Fall Asleep",
  SUPPORT_ME = "Support Me",
  WELCOME = "Welcome",
}

export interface Settings {
  type: SettingsType
  value: string | number | boolean | undefined,
  id?: number
}

export interface ISettingsStore {

  getSettings(type?: SettingsType): Array<Settings> | undefined;

  setSettings(settings: Array<Settings>): void;

  addSetting(settings: Settings): void;

  editSetting(type: SettingsType, value: string | number | undefined): void

}

class SettingsStore implements ISettingsStore {

  public settings: Array<Settings> | undefined;
  public loading: boolean = true;

  constructor() {
    getItem("settings").then(
      (settings) => {
        this.setSettings(settings)
        this.loading = false;
        makeAutoObservable(this);
      }
    )
  }

  async getSettingsAsync(type?: SettingsType): Promise<Array<Settings> | undefined> {
    while (this.loading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return this.getSettings(type);
  }

  getSettings(type?: SettingsType): Array<Settings> | undefined {
    if (!this.settings) {
      return undefined
    }
    if (type) {
      let filteredSettings = this.settings.filter((setting) => setting.type == type);
      return filteredSettings;
    }

    return this.settings;
  }

  setSettings(settings: Array<Settings> | undefined): void {
    this.settings = settings;

    if (!settings) {
      this.settings = this.getInitialSettings();
    }

    setItem("settings", this.settings)
    action(async () => {
    });
  }

  addSetting(setting: Settings): void {
    if (!this.settings) {
      this.settings = [setting];
    }
    if (!setting.id) {
      setting.id = this.settings.length || Math.random() * 1000;
    }
    this.settings.push(setting);
    setItem("settings", this.settings)

    action(async () => {
    });
  }

  editSetting(type: SettingsType, value: string | number | boolean | undefined): void {
    this.settings = this.settings?.map((s) => {
      if (s.type == type) {
        s.value = value;
      }
      return s;
    });
    setItem("settings", this.settings)
    action(async () => {
    });
  }

  private getInitialSettings(): Settings[] {
    const settings: Settings[] = (Object.keys(SettingsType) as Array<keyof typeof SettingsType>).map((key, i) => {
      return {
        type: SettingsType[key],
        value: undefined,
        id: i
      }
    })
    return settings;
  }

}

export default new SettingsStore();
