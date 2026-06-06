"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Use a valid email format for the mock account.");
      return;
    }
    setError("");
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <Link href="/" className="mb-8 flex items-center gap-3 text-xl font-black"><span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span> MindMate AI</Link>
        <h1 className="text-4xl font-black">Welcome back to your exam-season support system.</h1>
        <p className="mt-4 text-muted-foreground">This mock authentication flow behaves like a real account while keeping data private in local storage for hackathon demos.</p>
      </div>
      <Card>
        <div className="mb-5 flex rounded-md bg-muted p-1">
          <button className={`flex-1 rounded-md px-3 py-2 text-sm font-bold ${mode === "signin" ? "bg-card shadow" : ""}`} onClick={() => setMode("signin")}>Sign in</button>
          <button className={`flex-1 rounded-md px-3 py-2 text-sm font-bold ${mode === "signup" ? "bg-card shadow" : ""}`} onClick={() => setMode("signup")}>Sign up</button>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Any demo password" />
          </div>
          {error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" type="submit">{mode === "signin" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />} {mode === "signin" ? "Sign in" : "Create account"}</Button>
        </form>
      </Card>
    </div>
  );
}
