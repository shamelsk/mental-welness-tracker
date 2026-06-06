"use client";

import Link from "next/link";
import { AlertTriangle, BookOpen, Brain, Flame, Plus, Smile, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CountdownCard } from "@/components/CountdownCard";
import { MetricCard } from "@/components/MetricCard";
import { WellnessScoreCard } from "@/components/WellnessScoreCard";
import { EmptyState } from "@/components/EmptyState";
import { useMindMate } from "@/hooks/useMindMate";
import { buildInsights, burnoutRisk, journalStreak, moodStreak } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import type { AppData } from "@/types";

export default function DashboardPage() {
  const { data, loadSample } = useMindMate();
  const profile = data.profile;
  const risk = burnoutRisk(data);
  const insights = buildInsights(data);
  const latestMood = data.moodEntries[0];

  if (!profile && !data.moodEntries.length) {
    return <EmptyState icon={Brain} title="Set up your student wellness dashboard" body="Create a profile or load sample data to explore every feature with realistic exam-season logs." action="Load judge demo data" onAction={loadSample} />;
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Good {greeting()}, {profile?.name ?? "student"}</p>
            <h2 className="text-2xl font-black">Your exam support center is ready.</h2>
            <p className="mt-1 text-muted-foreground">{profile?.examType ?? "Exam"} prep, stress tracking, journaling, and AI coaching in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/mood"><Button><Plus className="h-4 w-4" /> Log mood</Button></Link>
            <Link href="/coach"><Button variant="outline"><Brain className="h-4 w-4" /> Ask coach</Button></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <WellnessScoreCard data={data} />
        <CountdownCard profile={profile} />
        <Card className={risk.level === "High Risk" ? "border-destructive" : ""}>
          <CardHeader><CardTitle>Burnout Risk</CardTitle><AlertTriangle className="h-5 w-5 text-primary" /></CardHeader>
          <p className="text-3xl font-black">{risk.level}</p>
          <p className="mt-3 text-sm text-muted-foreground">{risk.message}</p>
          <Link href="/calm"><Button className="mt-5 w-full" variant={risk.level === "High Risk" ? "danger" : "secondary"}>Open Calm Corner</Button></Link>
        </Card>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Smile} label="Today mood" value={latestMood?.mood ?? "No log"} helper={latestMood ? `${latestMood.stressLevel}/10 stress, ${latestMood.sleepHours}h sleep` : "Add your first check-in."} />
        <MetricCard icon={Flame} label="Mood streak" value={`${moodStreak(data.moodEntries)}d`} helper="Daily mood logging streak." />
        <MetricCard icon={BookOpen} label="Journal streak" value={`${journalStreak(data)}d`} helper="Reflection consistency." />
        <MetricCard icon={Trophy} label="Achievements" value={achievementCount(data)} helper="Unlocked wellness badges." />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>AI Insight Preview</CardTitle><Brain className="h-5 w-5 text-primary" /></CardHeader>
          <div className="grid gap-3">
            {insights.map((insight) => (
              <div key={insight.title} className="rounded-md bg-muted p-4">
                <p className="font-bold">{insight.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <div className="space-y-4">
            {data.moodEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="border-b border-border pb-3 last:border-b-0">
                <p className="font-bold">{entry.mood} · stress {entry.stressLevel}/10</p>
                <p className="text-sm text-muted-foreground">{formatDate(entry.createdAt)} · {entry.notes || "No note"}</p>
              </div>
            ))}
            {data.journalEntries.slice(0, 2).map((entry) => (
              <div key={entry.id} className="border-b border-border pb-3 last:border-b-0">
                <p className="font-bold">{entry.prompt}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{entry.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function achievementCount(data: AppData) {
  let count = 0;
  if (moodStreak(data.moodEntries) >= 3) count += 1;
  if (journalStreak(data) >= 7) count += 1;
  if (data.moodEntries.some((e) => e.sleepHours >= 7)) count += 1;
  if (data.moodEntries.some((e) => e.triggers.length)) count += 1;
  return count;
}
