import { HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { wellnessScore } from "@/lib/insights";
import type { AppData } from "@/types";

export function WellnessScoreCard({ data }: { data: AppData }) {
  const score = wellnessScore(data);
  const status = score >= 78 ? "Strong" : score >= 55 ? "Watchful" : "Needs care";
  const body = score >= 78
    ? "Your recent sleep, mood, and consistency signals look supportive."
    : score >= 55
      ? "You have a workable base. Improve sleep and recovery to raise this score."
      : "Your logs suggest strain. Lower the load and add immediate recovery support.";
  return (
    <Card>
      <CardHeader><CardTitle>Wellness Score</CardTitle><HeartPulse className="h-5 w-5 text-primary" /></CardHeader>
      <div className="flex items-end justify-between gap-4">
        <p className="text-6xl font-black">{score}</p>
        <span className="rounded-md bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">{status}</span>
      </div>
      <div className="mt-5"><ProgressBar value={score} label="Wellness score" /></div>
      <p className="mt-4 text-sm text-muted-foreground">{body}</p>
    </Card>
  );
}
