import type { ExamType, Mood, SupportStyle } from "@/types";

export const moodOptions: Mood[] = [
  "Happy",
  "Calm",
  "Neutral",
  "Sad",
  "Anxious",
  "Overwhelmed",
  "Burned Out",
  "Motivated",
  "Frustrated"
];

export const examTypes: ExamType[] = ["Board Exams", "JEE", "NEET", "CUET", "CAT", "GATE", "UPSC", "Other"];

export const supportStyles: { value: SupportStyle; label: string }[] = [
  { value: "gentle", label: "Gentle reassurance" },
  { value: "practical", label: "Practical steps" },
  { value: "motivational", label: "Motivational push" },
  { value: "coach", label: "Balanced coach" }
];

export const stressTriggers = [
  "syllabus overload",
  "mock test fear",
  "poor scores",
  "parental pressure",
  "social comparison",
  "procrastination",
  "time management",
  "sleep deprivation",
  "uncertainty about results",
  "lack of revision",
  "health issues",
  "financial stress",
  "performance anxiety"
];

export const journalPrompts = [
  "What challenged me today?",
  "What went well today?",
  "What am I worried about?",
  "What small win did I have today?",
  "What support do I need?"
];

export const affirmations = [
  "I can take the next small step.",
  "My worth is bigger than one score.",
  "Rest helps my brain remember.",
  "I can feel anxious and still move gently.",
  "Progress counts even when it is quiet."
];
