"use client";

import type { AppData, Settings } from "@/types";

export const STORAGE_KEY = "mindmate-ai-data-v1";

const defaultSettings: Settings = {
  theme: "light",
  reminders: true,
  privacyMode: false,
  supportStyle: "coach"
};

export const defaultData: AppData = {
  profile: null,
  moodEntries: [],
  journalEntries: [],
  settings: defaultSettings
};

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...defaultData,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      moodEntries: parsed.moodEntries ?? [],
      journalEntries: parsed.journalEntries ?? []
    };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(data: AppData) {
  return JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2);
}
