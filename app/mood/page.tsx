"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Filter, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { moodOptions, stressTriggers } from "@/data/options";
import { moodSchema } from "@/lib/schemas";
import { chartSeries } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import { useMindMate } from "@/hooks/useMindMate";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { MoodEntry } from "@/types";

type MoodValues = z.infer<typeof moodSchema>;

export default function MoodPage() {
  const { data, addMood, updateMood, deleteMood } = useMindMate();
  const [editing, setEditing] = useState<MoodEntry | null>(null);
  const [moodFilter, setMoodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const form = useForm<MoodValues>({
    resolver: zodResolver(moodSchema),
    defaultValues: { mood: "Neutral", intensity: 5, energyLevel: 5, stressLevel: 5, sleepHours: 7, notes: "", triggers: [] }
  });
  const selectedTriggers = form.watch("triggers") ?? [];

  const filtered = useMemo(() => data.moodEntries.filter((entry) => {
    const moodOk = moodFilter === "All" || entry.mood === moodFilter;
    const dateOk = !dateFilter || entry.createdAt.slice(0, 10) === dateFilter;
    return moodOk && dateOk;
  }), [data.moodEntries, moodFilter, dateFilter]);

  function submit(values: MoodValues) {
    const normalized = { ...values, notes: values.notes ?? "", triggers: values.triggers ?? [] };
    if (editing) {
      updateMood(editing.id, normalized);
      setEditing(null);
    } else {
      addMood(normalized);
    }
    form.reset({ mood: "Neutral", intensity: 5, energyLevel: 5, stressLevel: 5, sleepHours: 7, notes: "", triggers: [] });
  }

  function startEdit(entry: MoodEntry) {
    setEditing(entry);
    form.reset({ mood: entry.mood, intensity: entry.intensity, energyLevel: entry.energyLevel, stressLevel: entry.stressLevel, sleepHours: entry.sleepHours, notes: entry.notes, triggers: entry.triggers });
  }

  function toggleTrigger(trigger: string) {
    form.setValue("triggers", selectedTriggers.includes(trigger) ? selectedTriggers.filter((t) => t !== trigger) : [...selectedTriggers, trigger], { shouldValidate: true });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader><CardTitle>{editing ? "Edit mood log" : "Log mood"}</CardTitle><Plus className="h-5 w-5 text-primary" /></CardHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div><Label>Mood</Label><Select {...form.register("mood")}>{moodOptions.map((mood) => <option key={mood}>{mood}</option>)}</Select></div>
          <Range label="Intensity" register={form.register("intensity")} value={form.watch("intensity")} />
          <Range label="Energy level" register={form.register("energyLevel")} value={form.watch("energyLevel")} />
          <Range label="Stress level" register={form.register("stressLevel")} value={form.watch("stressLevel")} />
          <div><Label>Sleep hours</Label><Input type="number" step="0.25" {...form.register("sleepHours")} /></div>
          <div><Label>Tags and triggers</Label><div className="flex flex-wrap gap-2">{stressTriggers.map((trigger) => <button type="button" key={trigger} onClick={() => toggleTrigger(trigger)} className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${selectedTriggers.includes(trigger) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{trigger}</button>)}</div></div>
          <div><Label>Notes</Label><Textarea {...form.register("notes")} placeholder="What happened? What helped?" /></div>
          <div className="flex gap-2">
            <Button type="submit">{editing ? "Save changes" : "Add mood log"}</Button>
            {editing ? <Button type="button" variant="ghost" onClick={() => { setEditing(null); form.reset(); }}>Cancel</Button> : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-5">
        <Card>
          <CardHeader><CardTitle>Mood and Stress Trend</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartSeries(data.moodEntries)}>
                <XAxis dataKey="date" /><YAxis domain={[0, 10]} /><Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#0f9f8f" strokeWidth={3} />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>History</CardTitle><Filter className="h-5 w-5 text-primary" /></CardHeader>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <Select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}><option>All</option>{moodOptions.map((mood) => <option key={mood}>{mood}</option>)}</Select>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>
          <div className="space-y-3">
            {filtered.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold">{entry.mood} · intensity {entry.intensity}/10</p>
                    <p className="text-sm text-muted-foreground">{formatDate(entry.createdAt)} · stress {entry.stressLevel}/10 · energy {entry.energyLevel}/10 · sleep {entry.sleepHours}h</p>
                    {entry.notes ? <p className="mt-2 text-sm">{entry.notes}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-1">{entry.triggers.map((t) => <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold" key={t}>{t}</span>)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" aria-label="Edit mood entry" onClick={() => startEdit(entry)}><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="danger" aria-label="Delete mood entry" onClick={() => deleteMood(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </article>
            ))}
            {!filtered.length ? <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">No mood entries match these filters.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Range({ label, register, value }: { label: string; register: UseFormRegisterReturn; value: number }) {
  return <div><Label>{label}: {value}</Label><Input type="range" min="1" max="10" {...register} /></div>;
}
