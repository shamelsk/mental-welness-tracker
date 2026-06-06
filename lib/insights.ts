import { affirmations } from "@/data/options";
import type { AppData, Insight, Mood, MoodEntry } from "@/types";
import { daysBetween } from "@/lib/utils";

const moodValue: Record<Mood, number> = {
  "Happy": 9,
  "Calm": 8,
  "Neutral": 6,
  "Sad": 3,
  "Anxious": 3,
  "Overwhelmed": 2,
  "Burned Out": 1,
  "Motivated": 8,
  "Frustrated": 4
};

export function wellnessScore(data: AppData) {
  const entries = data.moodEntries.slice(-14);
  if (!entries.length) return 62;
  const avgMood = average(entries.map((e) => moodValue[e.mood])) * 8;
  const avgStress = 100 - average(entries.map((e) => e.stressLevel)) * 9;
  const sleep = Math.max(0, 100 - average(entries.map((e) => Math.abs(7.5 - e.sleepHours))) * 14);
  const journaling = Math.min(100, data.journalEntries.filter((j) => daysBetween(new Date(j.createdAt), new Date()) <= 14).length * 12);
  const streak = Math.min(100, moodStreak(data.moodEntries) * 12);
  return Math.round(clamp(avgMood * 0.28 + avgStress * 0.28 + sleep * 0.22 + journaling * 0.12 + streak * 0.1, 0, 100));
}

export function burnoutRisk(data: AppData) {
  const recent = data.moodEntries.slice(-7);
  if (!recent.length) return { level: "Moderate Risk" as const, score: 42, message: "Start logging for a sharper read on your recovery pattern." };
  const highStress = recent.filter((e) => e.stressLevel >= 8).length;
  const lowSleep = recent.filter((e) => e.sleepHours < 6).length;
  const hardMoods = recent.filter((e) => ["Anxious", "Overwhelmed", "Burned Out", "Sad"].includes(e.mood)).length;
  const score = highStress * 18 + lowSleep * 15 + hardMoods * 14 - moodStreak(recent) * 5;
  if (score >= 95) return { level: "High Risk" as const, score, message: "Your recent pattern suggests strain. Reduce load today and reach out to someone trusted." };
  if (score >= 45) return { level: "Moderate Risk" as const, score, message: "Some warning signs are showing. Add sleep protection and a short recovery block." };
  return { level: "Low Risk" as const, score, message: "Your recovery signals look steady. Keep protecting the basics." };
}

export function moodStreak(entries: MoodEntry[]) {
  const days = new Set(entries.map((e) => new Date(e.createdAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i += 1) {
    if (days.has(cursor.toDateString())) streak += 1;
    else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function journalStreak(data: AppData) {
  const days = new Set(data.journalEntries.map((e) => new Date(e.createdAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i += 1) {
    if (days.has(cursor.toDateString())) streak += 1;
    else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function triggerCounts(entries: MoodEntry[]) {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    entry.triggers.forEach((trigger) => {
      acc[trigger] = (acc[trigger] ?? 0) + 1;
    });
    return acc;
  }, {});
}

export function buildInsights(data: AppData): Insight[] {
  const entries = data.moodEntries;
  const insights: Insight[] = [];
  const lowSleep = entries.filter((e) => e.sleepHours < 6);
  const journalDays = new Set(data.journalEntries.map((j) => new Date(j.createdAt).toDateString()));
  const journalMood = entries.filter((e) => journalDays.has(new Date(e.createdAt).toDateString()));
  const counts = triggerCounts(entries);
  const topTrigger = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  if (lowSleep.length >= 2) {
    insights.push({ title: "Sleep is a strong signal", body: "Your stress increases when sleep drops below 6 hours. Protecting bedtime may give you the fastest relief.", tone: "warning" });
  }
  if (journalMood.length >= 2) {
    insights.push({ title: "Journaling helps", body: "You tend to feel more settled on days when you journal. Keep it short and consistent.", tone: "positive" });
  }
  if (topTrigger) {
    insights.push({ title: "Most common trigger", body: `${capitalize(topTrigger[0])} appears most often in your logs. Plan one tiny action around it today.`, tone: "neutral" });
  }
  if (entries.some((e) => e.triggers.includes("mock test fear") && e.stressLevel >= 7)) {
    insights.push({ title: "Mock test pattern", body: "Mock test days are linked to higher anxiety. Try a review ritual focused on learning, not judging.", tone: "warning" });
  }
  if (!insights.length) {
    insights.push({ title: "Ready when you are", body: "Log mood, sleep, and triggers for a few days and MindMate will spot patterns for you.", tone: "neutral" });
  }
  return insights.slice(0, 5);
}

export function coachFallback(data: AppData, message: string) {
  const risk = burnoutRisk(data);
  const score = wellnessScore(data);
  const insight = buildInsights(data)[0];
  const crisis = /harm myself|suicide|kill myself|end my life|can't go on/i.test(message);
  if (crisis) {
    return "I am really glad you said this out loud. Please contact local emergency services now, or tell a trusted person near you immediately. You deserve real human support in this moment. I can stay with you for grounding, but urgent help matters most.";
  }
  return [
    `I hear you. Based on your recent check-ins, your wellness score is ${score}/100 and burnout risk is ${risk.level.toLowerCase()}.`,
    insight.body,
    "For the next 10 minutes: drink water, do one round of box breathing, then write the smallest possible study step.",
    affirmations[Math.floor(Math.random() * affirmations.length)]
  ].join(" ");
}

export function chartSeries(entries: MoodEntry[]) {
  return entries.slice(-21).map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" }),
    mood: moodValue[e.mood],
    stress: e.stressLevel,
    sleep: e.sleepHours,
    energy: e.energyLevel,
    wellness: Math.round((moodValue[e.mood] * 8 + (10 - e.stressLevel) * 8 + Math.min(e.sleepHours, 8) * 8) / 3)
  }));
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
