import { NextResponse } from "next/server";
import { coachFallback } from "@/lib/insights";
import type { AppData } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { message?: string; data?: AppData } | null;
  const message = body?.message?.trim() ?? "";
  const data = body?.data;
  if (!message || !data) return NextResponse.json({ reply: "Tell me what is going on, and I will help you choose one small next step.", fallback: true });

  const fallback = coachFallback(data, message);
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ reply: fallback, fallback: true });

  try {
    const response = await fetch(process.env.GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        temperature: 0.6,
        max_tokens: 420,
        messages: [
          {
            role: "system",
            content: "You are MindMate AI, an empathetic student wellness coach for exam stress. Do not diagnose. Avoid medical claims. Encourage professional support for severe distress. If crisis/self-harm appears, urge immediate local emergency support and trusted human contact. Keep responses concise, practical, warm, and non-judgmental."
          },
          {
            role: "user",
            content: JSON.stringify({
              studentProfile: data.profile,
              recentMoodLogs: data.moodEntries.slice(0, 8),
              recentJournalEntries: data.journalEntries.slice(0, 5),
              userMessage: message
            })
          }
        ]
      })
    });
    if (!response.ok) throw new Error(`Groq error ${response.status}`);
    const json = await response.json();
    const reply = json?.choices?.[0]?.message?.content;
    return NextResponse.json({ reply: reply || fallback, fallback: !reply });
  } catch {
    return NextResponse.json({ reply: fallback, fallback: true });
  }
}
