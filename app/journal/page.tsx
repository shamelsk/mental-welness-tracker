"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { journalPrompts } from "@/data/options";
import { journalSchema } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { useMindMate } from "@/hooks/useMindMate";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { JournalEntry } from "@/types";

type JournalValues = z.infer<typeof journalSchema>;

export default function JournalPage() {
  const { data, addJournal, updateJournal, deleteJournal } = useMindMate();
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [query, setQuery] = useState("");
  const form = useForm<JournalValues>({ resolver: zodResolver(journalSchema), defaultValues: { prompt: journalPrompts[0], body: "", gratitude: "", emotion: "" } });
  const entries = useMemo(() => data.journalEntries.filter((entry) => `${entry.prompt} ${entry.body} ${entry.gratitude} ${entry.emotion}`.toLowerCase().includes(query.toLowerCase())), [data.journalEntries, query]);

  function submit(values: JournalValues) {
    const normalized = { ...values, gratitude: values.gratitude ?? "", emotion: values.emotion ?? "" };
    if (editing) {
      updateJournal(editing.id, normalized);
      setEditing(null);
    } else {
      addJournal(normalized);
    }
    form.reset({ prompt: journalPrompts[(new Date().getDate()) % journalPrompts.length], body: "", gratitude: "", emotion: "" });
  }

  function startEdit(entry: JournalEntry) {
    setEditing(entry);
    form.reset({ prompt: entry.prompt, body: entry.body, gratitude: entry.gratitude, emotion: entry.emotion });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader><CardTitle>{editing ? "Edit reflection" : "Guided Journal"}</CardTitle></CardHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div><Label>Prompt</Label><Select {...form.register("prompt")}>{journalPrompts.map((prompt) => <option key={prompt}>{prompt}</option>)}</Select></div>
          <div>
            <Label>Reflection</Label>
            <Textarea
              {...form.register("body")}
              placeholder="Write freely. Press Enter to save, Shift+Enter for a new line."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void form.handleSubmit(submit)();
                }
              }}
            />
          </div>
          <div><Label>Gratitude</Label><Input {...form.register("gratitude")} placeholder="One thing I appreciate today" /></div>
          <div><Label>Emotion</Label><Input {...form.register("emotion")} placeholder="How would I name this feeling?" /></div>
          {form.formState.errors.body ? <p className="text-sm text-destructive">{form.formState.errors.body.message}</p> : null}
          <div className="flex gap-2">
            <Button type="submit">{editing ? "Save entry" : "Add journal entry"}</Button>
            {editing ? <Button type="button" variant="ghost" onClick={() => { setEditing(null); form.reset(); }}>Cancel</Button> : null}
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader><CardTitle>Reflection Timeline</CardTitle><Search className="h-5 w-5 text-primary" /></CardHeader>
        <Input className="mb-4" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reflections, gratitude, emotions..." aria-label="Search journal entries" />
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{formatDate(entry.createdAt)}</p>
                  <h2 className="font-bold">{entry.prompt}</h2>
                  <p className="mt-2 text-sm">{entry.body}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.gratitude ? `Gratitude: ${entry.gratitude}` : ""} {entry.emotion ? `- Emotion: ${entry.emotion}` : ""}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" aria-label="Edit journal entry" onClick={() => startEdit(entry)}><Edit3 className="h-4 w-4" /></Button>
                  <Button variant="danger" aria-label="Delete journal entry" onClick={() => deleteJournal(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </article>
          ))}
          {!entries.length ? <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">No journal entries match your search.</p> : null}
        </div>
      </Card>
    </div>
  );
}
