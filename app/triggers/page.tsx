"use client";

import { AlertCircle, Lightbulb } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useMindMate } from "@/hooks/useMindMate";
import { buildInsights, triggerCounts } from "@/lib/insights";

const colors = ["#0f9f8f", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

export default function TriggersPage() {
  const { data } = useMindMate();
  const counts = Object.entries(triggerCounts(data.moodEntries)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const top = counts[0];
  const suggestions = buildInsights(data);

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Most Common Trigger</CardTitle><AlertCircle className="h-5 w-5 text-primary" /></CardHeader><p className="text-3xl font-black">{top?.name ?? "No trigger yet"}</p><p className="mt-2 text-sm text-muted-foreground">{top ? `${top.value} recent mentions` : "Add triggers in mood logs to discover patterns."}</p></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Smart Suggestions</CardTitle><Lightbulb className="h-5 w-5 text-primary" /></CardHeader><div className="grid gap-3">{suggestions.map((s) => <p key={s.title} className="rounded-md bg-muted p-3 text-sm"><b>{s.title}:</b> {s.body}</p>)}</div></Card>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Trigger Frequency</CardTitle></CardHeader>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={counts}><XAxis dataKey="name" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#0f9f8f" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Distribution</CardTitle></CardHeader>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={counts} dataKey="value" nameKey="name" outerRadius={105} label>{counts.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Recent Trigger Patterns</CardTitle></CardHeader>
        <div className="grid gap-3 md:grid-cols-2">
          {data.moodEntries.slice(0, 8).map((entry) => (
            <div key={entry.id} className="rounded-md border border-border p-3">
              <p className="font-bold">{new Date(entry.createdAt).toLocaleDateString()} · {entry.mood} · stress {entry.stressLevel}/10</p>
              <p className="mt-1 text-sm text-muted-foreground">{entry.triggers.length ? entry.triggers.join(", ") : "No trigger tagged"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
