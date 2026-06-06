"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, BookOpen, Brain, HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { useMindMate } from "@/hooks/useMindMate";
import { burnoutRisk, chartSeries, journalStreak, moodStreak, triggerCounts, wellnessScore } from "@/lib/insights";

export default function AnalyticsPage() {
  const { data } = useMindMate();
  const series = chartSeries(data.moodEntries);
  const triggers = Object.entries(triggerCounts(data.moodEntries)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  const journalConsistency = data.journalEntries.length ? Math.min(100, data.journalEntries.length * 12) : 0;
  const risk = burnoutRisk(data);

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={HeartPulse} label="Wellness score" value={wellnessScore(data)} helper="Composite of mood, sleep, stress, journaling, and streaks." />
        <MetricCard icon={Brain} label="Burnout risk" value={risk.level.replace(" Risk", "")} helper={risk.message} />
        <MetricCard icon={BookOpen} label="Journal consistency" value={`${journalConsistency}%`} helper={`${journalStreak(data)} day current streak.`} />
        <MetricCard icon={BarChart3} label="Mood streak" value={`${moodStreak(data.moodEntries)}d`} helper="Logged check-ins without a break." />
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Mood Trend Over Time"><LineChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 10]} /><Tooltip /><Line dataKey="mood" stroke="#0f9f8f" strokeWidth={3} /></LineChart></ChartCard>
        <ChartCard title="Stress Trend"><AreaChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 10]} /><Tooltip /><Area dataKey="stress" fill="#fecaca" stroke="#ef4444" strokeWidth={3} /></AreaChart></ChartCard>
        <ChartCard title="Sleep vs Mood Correlation"><LineChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="sleep" stroke="#2563eb" strokeWidth={3} /><Line dataKey="mood" stroke="#0f9f8f" strokeWidth={3} /></LineChart></ChartCard>
        <ChartCard title="Trigger Distribution"><BarChart data={triggers}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Wellness Score Trend"><AreaChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 100]} /><Tooltip /><Area dataKey="wellness" fill="#ccfbf1" stroke="#0f9f8f" strokeWidth={3} /></AreaChart></ChartCard>
        <ChartCard title="Energy and Recovery"><LineChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 10]} /><Tooltip /><Line dataKey="energy" stroke="#8b5cf6" strokeWidth={3} /><Line dataKey="stress" stroke="#ef4444" strokeWidth={3} /></LineChart></ChartCard>
      </section>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </Card>
  );
}
