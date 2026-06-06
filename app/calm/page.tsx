"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { affirmations } from "@/data/options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";

const grounding = [
  "Name 5 things you can see.",
  "Name 4 things you can feel.",
  "Name 3 things you can hear.",
  "Name 2 things you can smell.",
  "Name 1 thing you can taste or appreciate."
];

export default function CalmPage() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [breath, setBreath] = useState(0);
  const [groundStep, setGroundStep] = useState(0);
  const phase = useMemo(() => ["Inhale", "Hold", "Exhale", "Hold"][Math.floor((breath % 16) / 4)], [breath]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
      setBreath((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <Card className="bg-gradient-to-br from-card to-accent/50">
        <CardHeader><CardTitle>Box Breathing Timer</CardTitle></CardHeader>
        <div className="grid place-items-center py-6">
          <div className="grid h-56 w-56 place-items-center rounded-full border-8 border-primary/30 bg-background text-center shadow-soft">
            <div><p className="text-3xl font-black">{phase}</p><p className="text-sm text-muted-foreground">4 second rhythm</p></div>
          </div>
        </div>
        <ProgressBar value={((60 - seconds) / 60) * 100} label="One minute recovery progress" />
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setRunning((v) => !v)}>{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Start"}</Button>
          <Button variant="outline" onClick={() => { setSeconds(60); setBreath(0); setRunning(false); }}><RotateCcw className="h-4 w-4" /> Reset</Button>
          <span className="rounded-md bg-muted px-3 py-2 text-sm font-bold">{seconds}s</span>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card>
          <CardHeader><CardTitle>5-4-3-2-1 Grounding</CardTitle></CardHeader>
          <p className="text-lg font-bold">{grounding[groundStep]}</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setGroundStep(Math.min(grounding.length - 1, groundStep + 1))}>Next step</Button>
            <Button variant="ghost" onClick={() => setGroundStep(0)}>Restart</Button>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Calming Affirmations</CardTitle></CardHeader>
          <div className="grid gap-2">{affirmations.map((item) => <p key={item} className="rounded-md bg-muted p-3 text-sm font-semibold">{item}</p>)}</div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Panic-to-Calm Quick Actions</CardTitle></CardHeader>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>1. Unclench your jaw and drop your shoulders.</p>
            <p>2. Put both feet on the floor and lengthen your exhale.</p>
            <p>3. Text one trusted person: “I feel overwhelmed. Can you stay with me for a few minutes?”</p>
            <p>4. Choose one tiny next action, not the whole exam plan.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
