"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { examTypes, supportStyles } from "@/data/options";
import { profileSchema } from "@/lib/schemas";
import { useMindMate } from "@/hooks/useMindMate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { UserProfile } from "@/types";

type FormValues = z.infer<typeof profileSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { data, setProfile, loadSample } = useMindMate();
  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data.profile?.name ?? "",
      age: data.profile?.age ?? 17,
      examType: data.profile?.examType ?? "JEE",
      examDate: data.profile?.examDate ?? "",
      dailyStudyHours: data.profile?.dailyStudyHours ?? 6,
      sleepPattern: data.profile?.sleepPattern ?? "",
      currentStressLevel: data.profile?.currentStressLevel ?? 5,
      goals: data.profile?.goals ?? "",
      supportStyle: data.profile?.supportStyle ?? "coach"
    } as FormValues
  });

  function onSubmit(values: FormValues) {
    setProfile({ ...values, onboarded: true, createdAt: data.profile?.createdAt ?? new Date().toISOString() } as UserProfile);
    router.push("/welcome");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-7">
        <p className="text-sm font-bold text-primary">Profile setup</p>
        <h1 className="text-4xl font-black">Personalize MindMate for your exam season.</h1>
        <p className="mt-3 text-muted-foreground">These answers power countdowns, recommendations, AI context, wellness score, and burnout guidance.</p>
      </div>
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
          <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
          <Field label="Age" error={form.formState.errors.age?.message}><Input type="number" {...form.register("age")} /></Field>
          <Field label="Exam type"><Select {...form.register("examType")}>{examTypes.map((exam) => <option key={exam}>{exam}</option>)}</Select></Field>
          <Field label="Exam date" error={form.formState.errors.examDate?.message}><Input type="date" {...form.register("examDate")} /></Field>
          <Field label="Daily study hours"><Input type="number" step="0.5" {...form.register("dailyStudyHours")} /></Field>
          <Field label="Current stress level"><Input type="range" min="1" max="10" {...form.register("currentStressLevel")} /><p className="text-sm text-muted-foreground">1 calm, 10 intense</p></Field>
          <Field label="Sleep pattern" error={form.formState.errors.sleepPattern?.message}><Textarea {...form.register("sleepPattern")} /></Field>
          <Field label="Goals" error={form.formState.errors.goals?.message}><Textarea {...form.register("goals")} /></Field>
          <Field label="Preferred support style"><Select {...form.register("supportStyle")}>{supportStyles.map((style) => <option value={style.value} key={style.value}>{style.label}</option>)}</Select></Field>
          <div className="flex flex-wrap items-end gap-3 md:col-span-2">
            <Button type="submit">Finish onboarding</Button>
            <Button type="button" variant="outline" onClick={() => { loadSample(); router.push("/welcome"); }}>Load judge demo data</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return <div><Label htmlFor={id}>{label}</Label>{children}{error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}</div>;
}
