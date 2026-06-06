"use client";

import { Download, RefreshCcw, Save, Upload } from "lucide-react";
import { useState } from "react";
import { examTypes, supportStyles } from "@/data/options";
import { useMindMate } from "@/hooks/useMindMate";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { ExamType, SupportStyle, UserProfile } from "@/types";

export default function SettingsPage() {
  const { data, setProfile, updateSettings, resetData, importJson, exportJson } = useMindMate();
  const [profile, setDraft] = useState<UserProfile>(data.profile ?? {
    name: "",
    age: 17,
    examType: "JEE",
    examDate: "",
    dailyStudyHours: 6,
    sleepPattern: "",
    currentStressLevel: 5,
    goals: "",
    supportStyle: "coach",
    onboarded: true,
    createdAt: new Date().toISOString()
  });
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");

  function saveProfile() {
    setProfile(profile);
    updateSettings({ supportStyle: profile.supportStyle });
    setStatus("Profile saved.");
  }

  function downloadBackup() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmate-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exported.");
  }

  function restore() {
    const ok = importJson(importText);
    setStatus(ok ? "Backup imported successfully." : "Import failed. Check that this is valid MindMate JSON.");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><Input value={profile.name} onChange={(e) => setDraft({ ...profile, name: e.target.value })} /></Field>
          <Field label="Age"><Input type="number" value={profile.age} onChange={(e) => setDraft({ ...profile, age: Number(e.target.value) })} /></Field>
          <Field label="Exam type"><Select value={profile.examType} onChange={(e) => setDraft({ ...profile, examType: e.target.value as ExamType })}>{examTypes.map((exam) => <option key={exam}>{exam}</option>)}</Select></Field>
          <Field label="Exam date"><Input type="date" value={profile.examDate} onChange={(e) => setDraft({ ...profile, examDate: e.target.value })} /></Field>
          <Field label="Daily study hours"><Input type="number" step="0.5" value={profile.dailyStudyHours} onChange={(e) => setDraft({ ...profile, dailyStudyHours: Number(e.target.value) })} /></Field>
          <Field label="Stress level"><Input type="range" min="1" max="10" value={profile.currentStressLevel} onChange={(e) => setDraft({ ...profile, currentStressLevel: Number(e.target.value) })} /></Field>
          <Field label="Sleep pattern"><Textarea value={profile.sleepPattern} onChange={(e) => setDraft({ ...profile, sleepPattern: e.target.value })} /></Field>
          <Field label="Goals"><Textarea value={profile.goals} onChange={(e) => setDraft({ ...profile, goals: e.target.value })} /></Field>
          <Field label="Support style"><Select value={profile.supportStyle} onChange={(e) => setDraft({ ...profile, supportStyle: e.target.value as SupportStyle })}>{supportStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}</Select></Field>
        </div>
        <Button className="mt-5" onClick={saveProfile}><Save className="h-4 w-4" /> Save profile</Button>
      </Card>

      <div className="grid gap-5">
        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <label className="flex items-center justify-between gap-3 rounded-md bg-muted p-3 text-sm font-semibold">
            Dark mode
            <input type="checkbox" checked={data.settings.theme === "dark"} onChange={(e) => updateSettings({ theme: e.target.checked ? "dark" : "light" })} />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3 rounded-md bg-muted p-3 text-sm font-semibold">
            Reminder preferences
            <input type="checkbox" checked={data.settings.reminders} onChange={(e) => updateSettings({ reminders: e.target.checked })} />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3 rounded-md bg-muted p-3 text-sm font-semibold">
            Privacy mode
            <input type="checkbox" checked={data.settings.privacyMode} onChange={(e) => updateSettings({ privacyMode: e.target.checked })} />
          </label>
        </Card>
        <Card>
          <CardHeader><CardTitle>Data Backup</CardTitle></CardHeader>
          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadBackup}><Download className="h-4 w-4" /> Export JSON</Button>
            <Button variant="danger" onClick={() => { if (confirm("Reset all MindMate local data?")) resetData(); }}><RefreshCcw className="h-4 w-4" /> Reset data</Button>
          </div>
          <Textarea className="mt-4" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste MindMate backup JSON here" />
          <Button className="mt-3" variant="outline" onClick={restore}><Upload className="h-4 w-4" /> Import JSON</Button>
          {status ? <p className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">{status}</p> : null}
        </Card>
        <Card>
          <CardHeader><CardTitle>Privacy and Safety Notes</CardTitle></CardHeader>
          <p className="text-sm text-muted-foreground">Data is stored locally in this browser. AI responses are supportive and not clinical care. For severe distress, involve a trusted person or professional immediately.</p>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}
