"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { sampleData } from "@/data/sample";
import { defaultData, exportData, loadData, saveData } from "@/lib/storage";
import { uid } from "@/lib/utils";
import type { AppData, JournalEntry, MoodEntry, Settings, UserProfile } from "@/types";

interface MindMateContext {
  data: AppData;
  hydrated: boolean;
  setProfile: (profile: UserProfile) => void;
  addMood: (entry: Omit<MoodEntry, "id" | "createdAt"> & { createdAt?: string }) => void;
  updateMood: (id: string, entry: Partial<MoodEntry>) => void;
  deleteMood: (id: string) => void;
  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt"> & { createdAt?: string }) => void;
  updateJournal: (id: string, entry: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetData: () => void;
  loadSample: () => void;
  importJson: (json: string) => boolean;
  exportJson: () => string;
}

const Context = createContext<MindMateContext | null>(null);

export function MindMateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveData(data);
    document.documentElement.classList.toggle("dark", data.settings.theme === "dark");
  }, [data, hydrated]);

  const value = useMemo<MindMateContext>(() => ({
    data,
    hydrated,
    setProfile: (profile) => setData((prev) => ({ ...prev, profile })),
    addMood: (entry) => setData((prev) => ({
      ...prev,
      moodEntries: [{ ...entry, id: uid("mood"), createdAt: entry.createdAt ?? new Date().toISOString() }, ...prev.moodEntries]
    })),
    updateMood: (id, entry) => setData((prev) => ({
      ...prev,
      moodEntries: prev.moodEntries.map((item) => (item.id === id ? { ...item, ...entry } : item))
    })),
    deleteMood: (id) => setData((prev) => ({ ...prev, moodEntries: prev.moodEntries.filter((item) => item.id !== id) })),
    addJournal: (entry) => setData((prev) => ({
      ...prev,
      journalEntries: [{ ...entry, id: uid("journal"), createdAt: entry.createdAt ?? new Date().toISOString() }, ...prev.journalEntries]
    })),
    updateJournal: (id, entry) => setData((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.map((item) => (item.id === id ? { ...item, ...entry } : item))
    })),
    deleteJournal: (id) => setData((prev) => ({ ...prev, journalEntries: prev.journalEntries.filter((item) => item.id !== id) })),
    updateSettings: (settings) => setData((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } })),
    resetData: () => setData(defaultData),
    loadSample: () => setData(sampleData),
    importJson: (json) => {
      try {
        const parsed = JSON.parse(json) as AppData;
        if (!parsed || !("settings" in parsed)) return false;
        setData({ ...defaultData, ...parsed });
        return true;
      } catch {
        return false;
      }
    },
    exportJson: () => exportData(data)
  }), [data, hydrated]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMindMate() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useMindMate must be used inside MindMateProvider");
  return ctx;
}
