import {create} from "zustand";
import {getItem, setItem} from "../utils/AsyncStorageUtils";

export enum SleepType {
  SLEEP = "sleep",
  POWERNAP = "powernap"
}

export interface Sleep {
  type: SleepType
  start: Date,
  end: Date,
  cycle?: number,
  id?: number
}

export interface SleepFilter {
  start?: Date,
  end?: Date,
}

interface SleepStore {
  sleeps: Array<Sleep> | undefined;
  getSleeps: (type?: SleepType, filters?: Partial<SleepFilter>) => Array<Sleep> | undefined;
  setSleeps: (sleeps: Array<Sleep>) => Promise<void>;
  addSleep: (sleep: Sleep) => Promise<void>;
  deleteSleep: (id: number) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useSleepStore = create<SleepStore>((set, get) => ({
  sleeps: undefined,

  initialize: async () => {
    let processedSleeps: Array<Sleep> = [];

    try {
      const sleeps = await getItem("sleeps");
      if (Array.isArray(sleeps)) {
        processedSleeps = sleeps;
      } else if (sleeps) {
        // Unexpected/corrupted data, default to empty array
        console.error("Unexpected data format for 'sleeps' in storage. Resetting to empty array.");
      }
    } catch (error) {
      console.error("Failed to load 'sleeps' from storage. Using empty array instead.", error);
    }

    set({ sleeps: processedSleeps });

    try {
      await setItem("sleeps", processedSleeps);
    } catch (error) {
      console.error("Failed to persist 'sleeps' to storage during initialization.", error);
    }
  },

  getSleeps: (type?: SleepType, filters?: Partial<SleepFilter>) => {
    const { sleeps } = get();
    if (!sleeps) {
      return undefined;
    }
    let filteredSleeps = sleeps;
    
    if (type) {
      filteredSleeps = filteredSleeps.filter((sleep) => sleep.type == type);
    }
    
    if (filters) {
      if (filters.start) {
        filteredSleeps = filteredSleeps.filter((sleep) => {
          return new Date(sleep.start) >= filters.start!;
        });
      }
      if (filters.end) {
        filteredSleeps = filteredSleeps.filter((sleep) => new Date(sleep.start) <= filters.end!);
      }
    }
    
    return filteredSleeps;
  },

  setSleeps: async (sleeps: Array<Sleep>) => {
    set({ sleeps });
    await setItem("sleeps", sleeps);
  },

  addSleep: async (sleep: Sleep) => {
    const { sleeps } = get();
    let newSleeps = sleeps || [];
    
    if (!sleep.id) {
      sleep.id = newSleeps.length || Math.random() * 1000;
    }
    newSleeps = [...newSleeps, sleep];
    
    set({ sleeps: newSleeps });
    await setItem("sleeps", newSleeps);
  },

  deleteSleep: async (id: number) => {
    const { sleeps } = get();
    if (!sleeps) {
      console.error("There is nothing to delete.");
      return;
    }
    
    const filteredSleeps = sleeps.filter((s) => s.id != id);
    set({ sleeps: filteredSleeps });
    await setItem("sleeps", filteredSleeps);
  },
}));

// Initialize store when explicitly requested (e.g., from app startup)
export const initializeSleepStore = () => {
  return useSleepStore.getState().initialize();
};
