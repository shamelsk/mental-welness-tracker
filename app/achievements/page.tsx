"use client";

import { Award, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { useMindMate } from "@/hooks/useMindMate";
import { journalStreak, moodStreak } from "@/lib/insights";

export default function AchievementsPage() {
  const { data } = useMindMate();
  const mood = moodStreak(data.moodEntries);
  const journal = journalStreak(data);
  const achievements = [
    { name: "3-day mood tracking streak", progress: mood, goal: 3 },
    { name: "7-day journaling streak", progress: journal, goal: 7 },
    { name: "14-day consistency badge", progress: Math.min(mood + journal, 14), goal: 14 },
    { name: "Healthy sleep badge", progress: data.moodEntries.filter((e) => e.sleepHours >= 7).length, goal: 3 },
    { name: "Stress awareness badge", progress: data.moodEntries.filter((e) => e.triggers.length).length, goal: 3 },
    { name: "Recovery streak badge", progress: data.moodEntries.filter((e) => e.stressLevel <= 5).length, goal: 5 }
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((item) => {
        const unlocked = item.progress >= item.goal;
        return (
          <Card key={item.name} className={unlocked ? "border-primary" : ""}>
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-md ${unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
              </span>
              {unlocked ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
            </div>
            <h2 className="mt-5 text-lg font-black">{item.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{Math.min(item.progress, item.goal)} of {item.goal} complete</p>
            <div className="mt-4"><ProgressBar value={(item.progress / item.goal) * 100} label={`${item.name} progress`} /></div>
          </Card>
        );
      })}
    </div>
  );
}
