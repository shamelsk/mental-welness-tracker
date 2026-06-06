"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, CalendarDays, CheckCircle2, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Brain, title: "AI wellness coach", body: "Personalized support from your profile, mood logs, triggers, sleep, and journal history." },
  { icon: BarChart3, title: "Stress analytics", body: "Readable charts that connect mood, sleep, triggers, journaling, and burnout risk." },
  { icon: HeartPulse, title: "Calm Corner", body: "Emergency grounding, box breathing, affirmations, and one-minute recovery flows." },
  { icon: CalendarDays, title: "Exam readiness", body: "Countdowns, progress indicators, streaks, and gentle nudges during high-pressure weeks." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          MindMate AI
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/auth"><Button variant="ghost">Sign in</Button></Link>
          <Link href="/onboarding"><Button>Start free <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
              <ShieldCheck className="h-4 w-4" /> Built for exam and result seasons
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              Track stress, understand emotions, and get personalized AI support during exam season.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              MindMate helps students prepare for boards, JEE, NEET, CUET, CAT, GATE, UPSC, and other high-pressure exams with practical wellness tools that keep working offline.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/onboarding"><Button className="min-w-36">Create profile <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/dashboard"><Button variant="outline" className="min-w-36">View demo</Button></Link>
            </div>
            <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {["Private local data", "AI fallback mode", "Crisis-aware safety copy"].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid gap-4">
            <Card className="bg-card/88">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wellness score</p>
                  <p className="text-5xl font-black">78</p>
                </div>
                <span className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">Steady</span>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-2" aria-hidden="true">
                {[40, 55, 48, 62, 68, 74, 78].map((h, i) => <div key={i} className="rounded-md bg-accent" style={{ height: `${h * 1.2}px` }} />)}
              </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card><p className="text-sm text-muted-foreground">AI insight</p><p className="mt-2 font-semibold">Stress spikes after low-sleep mock test days. Try a review ritual and earlier wind-down.</p></Card>
              <Card><p className="text-sm text-muted-foreground">Exam countdown</p><p className="mt-2 text-3xl font-black">42 days</p><p className="text-sm text-muted-foreground">Six focused weeks left.</p></Card>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-border bg-card/60 py-12">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-none">
                <feature.icon className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-lg font-bold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
