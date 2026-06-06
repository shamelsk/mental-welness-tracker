export type Mood =
  | "Happy"
  | "Calm"
  | "Neutral"
  | "Sad"
  | "Anxious"
  | "Overwhelmed"
  | "Burned Out"
  | "Motivated"
  | "Frustrated";

export type ExamType = "Board Exams" | "JEE" | "NEET" | "CUET" | "CAT" | "GATE" | "UPSC" | "Other";
export type SupportStyle = "gentle" | "practical" | "motivational" | "coach";
export type ThemeMode = "light" | "dark";

export interface UserProfile {
  name: string;
  age: number;
  examType: ExamType;
  examDate: string;
  dailyStudyHours: number;
  sleepPattern: string;
  currentStressLevel: number;
  goals: string;
  supportStyle: SupportStyle;
  onboarded: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  intensity: number;
  energyLevel: number;
  stressLevel: number;
  sleepHours: number;
  notes: string;
  triggers: string[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  body: string;
  gratitude: string;
  emotion: string;
  createdAt: string;
}

export interface Settings {
  theme: ThemeMode;
  reminders: boolean;
  privacyMode: boolean;
  supportStyle: SupportStyle;
}

export interface AppData {
  profile: UserProfile | null;
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  settings: Settings;
}

export interface Insight {
  title: string;
  body: string;
  tone: "positive" | "warning" | "neutral";
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
