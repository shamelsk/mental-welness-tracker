"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, CalendarDays, HeartPulse, PenLine, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountdownCard } from "@/components/CountdownCard";
import { WellnessScoreCard } from "@/components/WellnessScoreCard";
import { useMindMate } from "@/hooks/useMindMate";
import { buildInsights, burnoutRisk } from "@/lib/insights";

const steps = [
  { href: "/mood", label: "Log today's mood", body: "Capture stress, sleep, energy, notes, and triggers.", icon: Smile },
  { href: "/journal", label: "Write a reflection", body: "Use a guided prompt and build a recovery pattern.", icon: PenLine },
  { href: "/coach", label: "Ask the AI coach", body: "Get supportive suggestions with Groq or fallback logic.", icon: Brain },
  { href: "/analytics", label: "Explore analytics", body: "See trends across mood, sleep, triggers, and score.", icon: BarChart3 }
];

export default function WelcomePage() {
  const { data, loadSample } = useMindMate();
  const profile = data.profile;
  const risk = burnoutRisk(data);
  const insight = buildInsights(data)[0];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            MindMate AI
          </Link>
          <Link href="/dashboard"><Button variant="outline">Skip to dashboard</Button></Link>
        </header>

        <section className="grid min-h-[78vh] items-center gap-8 py-10 lg:grid-cols-[1fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
              <ShieldCheck className="h-4 w-4" /> Your private wellness workspace is ready
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Welcome{profile?.name ? `, ${profile.name}` : ""}. Let's make exam season feel manageable.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              MindMate connects your mood, stress triggers, sleep, journaling, exam countdown, and AI support into one calm daily routine.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/dashboard"><Button>Open dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
              {!profile ? <Button variant="outline" onClick={loadSample}>Load judge demo data</Button> : <Link href="/mood"><Button variant="outline">Start first check-in</Button></Link>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.08 }} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <WellnessScoreCard data={data} />
              <CountdownCard profile={profile} />
            </div>
            <Card>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                  <HeartPulse className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-black">Today's guidance</p>
                  <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
                  <p className="mt-3 rounded-md bg-muted p-3 text-sm font-semibold">Burnout risk: {risk.level}. {risk.message}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        <section className="pb-10">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-black">Recommended first actions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Link href={step.href} key={step.href}>
                <Card className="h-full transition hover:-translate-y-1 hover:border-primary">
                  <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-black">{step.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
