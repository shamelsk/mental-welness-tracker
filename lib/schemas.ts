import { z } from "zod";
import { examTypes, moodOptions, supportStyles } from "@/data/options";
import type { ExamType, Mood, SupportStyle } from "@/types";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(10).max(80),
  examType: z.enum(examTypes as [ExamType, ...ExamType[]]),
  examDate: z.string().min(1, "Exam date is required"),
  dailyStudyHours: z.coerce.number().min(0).max(18),
  sleepPattern: z.string().min(2),
  currentStressLevel: z.coerce.number().min(1).max(10),
  goals: z.string().min(5),
  supportStyle: z.enum(supportStyles.map((s) => s.value) as [SupportStyle, ...SupportStyle[]])
});

export const moodSchema = z.object({
  mood: z.enum(moodOptions as [Mood, ...Mood[]]),
  intensity: z.coerce.number().min(1).max(10),
  energyLevel: z.coerce.number().min(1).max(10),
  stressLevel: z.coerce.number().min(1).max(10),
  sleepHours: z.coerce.number().min(0).max(16),
  notes: z.string().default(""),
  triggers: z.array(z.string()).default([])
});

export const journalSchema = z.object({
  prompt: z.string().min(1),
  body: z.string().min(3),
  gratitude: z.string().default(""),
  emotion: z.string().default("")
});
