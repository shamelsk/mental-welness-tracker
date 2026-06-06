"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { daysBetween } from "@/lib/utils";
import type { UserProfile } from "@/types";

export function CountdownCard({ profile }: { profile: UserProfile | null }) {
  if (!profile?.examDate) {
    return (
      <Card>
        <CardHeader><CardTitle>Exam Countdown</CardTitle><CalendarDays className="h-5 w-5 text-primary" /></CardHeader>
        <p className="text-muted-foreground">Add an exam date in onboarding or settings to unlock readiness tracking.</p>
      </Card>
    );
  }
  const daysLeft = Math.max(0, daysBetween(new Date(), new Date(profile.examDate)));
  const weeks = Math.ceil(daysLeft / 7);
  const totalWindow = 120;
  const progress = Math.max(5, Math.min(100, 100 - (daysLeft / totalWindow) * 100));
  const readiness = daysLeft > 45 ? "Build rhythm" : daysLeft > 14 ? "Prioritize revision" : "Protect calm";
  return (
    <Card>
      <CardHeader><CardTitle>Exam Countdown</CardTitle><CalendarDays className="h-5 w-5 text-primary" /></CardHeader>
      <div className="flex items-end justify-between">
        <div><p className="text-5xl font-black">{daysLeft}</p><p className="text-sm text-muted-foreground">days left</p></div>
        <div className="text-right"><p className="text-2xl font-bold">{weeks}</p><p className="text-sm text-muted-foreground">weeks</p></div>
      </div>
      <div className="mt-5"><ProgressBar value={progress} label="Exam preparation progress" /></div>
      <p className="mt-4 rounded-md bg-accent p-3 text-sm font-semibold text-accent-foreground">{readiness}: one focused block at a time beats panic cramming.</p>
    </Card>
  );
}
