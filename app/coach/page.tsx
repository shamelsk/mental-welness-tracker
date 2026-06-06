"use client";

import { Brain, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useMindMate } from "@/hooks/useMindMate";
import { uid } from "@/lib/utils";
import { requestCoachReply } from "@/services/coach";
import type { CoachMessage } from "@/types";

export default function CoachPage() {
  const { data } = useMindMate();
  const [messages, setMessages] = useState<CoachMessage[]>([{
    id: "welcome",
    role: "assistant",
    content: "I am here with practical, non-judgmental support. Tell me what feels hardest today.",
    createdAt: new Date().toISOString()
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const userMessage: CoachMessage = { id: uid("msg"), role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    const reply = await requestCoachReply(text, data);
    setFallback(reply.fallback);
    setMessages((prev) => [...prev, { id: uid("msg"), role: "assistant", content: reply.reply, createdAt: new Date().toISOString() }]);
    setLoading(false);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <Card className="min-h-[70vh]">
        <CardHeader><CardTitle>AI Wellness Coach</CardTitle><Brain className="h-5 w-5 text-primary" /></CardHeader>
        <div className="mb-4 rounded-md bg-accent p-3 text-sm text-accent-foreground">
          MindMate is supportive software, not a replacement for professional mental health care.
        </div>
        <div className="flex h-[48vh] flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-background p-3" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`max-w-[86%] rounded-lg px-4 py-3 text-sm ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
              {message.content}
            </div>
          ))}
          {loading ? <div className="w-fit rounded-lg bg-muted px-4 py-3 text-sm">Thinking through your context...</div> : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send(); }} placeholder="Share what feels heavy, confusing, or urgent..." />
          <Button onClick={send} disabled={loading || !input.trim()}><Send className="h-4 w-4" /> Send</Button>
        </div>
      </Card>
      <aside className="grid gap-5">
        <Card>
          <CardHeader><CardTitle>Mode</CardTitle></CardHeader>
          <p className="text-sm text-muted-foreground">{fallback ? "Fallback mode is active. Rule-based coaching is keeping the app functional." : "Groq API mode will be used when GROQ_API_KEY is configured."}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Safety</CardTitle><ShieldAlert className="h-5 w-5 text-primary" /></CardHeader>
          <p className="text-sm text-muted-foreground">If you might harm yourself or someone else, contact local emergency services or a trusted person immediately.</p>
        </Card>
      </aside>
    </div>
  );
}
