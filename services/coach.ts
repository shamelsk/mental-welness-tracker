import type { AppData } from "@/types";
import { coachFallback } from "@/lib/insights";

export async function requestCoachReply(message: string, data: AppData) {
  try {
    const response = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, data })
    });
    if (!response.ok) throw new Error("Coach request failed");
    const json = await response.json() as { reply?: string; fallback?: boolean };
    return { reply: json.reply ?? coachFallback(data, message), fallback: Boolean(json.fallback) };
  } catch {
    return { reply: coachFallback(data, message), fallback: true };
  }
}
