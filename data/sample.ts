import type { AppData } from "@/types";

const today = new Date();
const ago = (days: number) => {
  const date = new Date(today);
  date.setDate(today.getDate() - days);
  return date.toISOString();
};

export const sampleData: AppData = {
  profile: {
    name: "Aarav",
    age: 17,
    examType: "JEE",
    examDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 42).toISOString().slice(0, 10),
    dailyStudyHours: 7,
    sleepPattern: "Usually 6.5 hours, late nights before mocks",
    currentStressLevel: 6,
    goals: "Stay consistent, reduce panic before mock tests, and sleep better.",
    supportStyle: "coach",
    onboarded: true,
    createdAt: ago(9)
  },
  moodEntries: [
    { id: "m1", mood: "Anxious", intensity: 7, energyLevel: 4, stressLevel: 8, sleepHours: 5.5, notes: "Mock score dropped.", triggers: ["mock test fear", "poor scores"], createdAt: ago(6) },
    { id: "m2", mood: "Neutral", intensity: 5, energyLevel: 6, stressLevel: 5, sleepHours: 7, notes: "Finished chemistry revision.", triggers: ["lack of revision"], createdAt: ago(5) },
    { id: "m3", mood: "Motivated", intensity: 8, energyLevel: 8, stressLevel: 4, sleepHours: 7.5, notes: "Good physics session.", triggers: [], createdAt: ago(4) },
    { id: "m4", mood: "Overwhelmed", intensity: 8, energyLevel: 3, stressLevel: 9, sleepHours: 5, notes: "Too many chapters pending.", triggers: ["syllabus overload", "time management"], createdAt: ago(2) },
    { id: "m5", mood: "Calm", intensity: 7, energyLevel: 7, stressLevel: 4, sleepHours: 7.2, notes: "Journaled and took breaks.", triggers: ["procrastination"], createdAt: ago(1) }
  ],
  journalEntries: [
    { id: "j1", prompt: "What challenged me today?", body: "The mock test result felt personal, but I found two topics to revise.", gratitude: "My friend explained a problem.", emotion: "Concerned but hopeful", createdAt: ago(6) },
    { id: "j2", prompt: "What small win did I have today?", body: "I completed organic revision without checking my phone.", gratitude: "A quiet evening.", emotion: "Proud", createdAt: ago(1) }
  ],
  settings: { theme: "light", reminders: true, privacyMode: false, supportStyle: "coach" }
};
