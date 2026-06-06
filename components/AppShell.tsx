"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, BarChart3, BookOpen, Brain, CalendarHeart, Home, LogIn, Menu, Moon, Settings, ShieldCheck, Smile, Sparkles, Trophy, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMindMate } from "@/hooks/useMindMate";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/triggers", label: "Triggers", icon: Activity },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calm", label: "Calm", icon: CalendarHeart },
  { href: "/achievements", label: "Badges", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, updateSettings } = useMindMate();
  const isMarketing = pathname === "/" || pathname === "/auth" || pathname === "/onboarding" || pathname === "/welcome";

  if (isMarketing) return <main>{children}</main>;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] border-r border-border bg-card/92 px-4 py-5 backdrop-blur lg:block">
        <Brand />
        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {nav.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} />)}
        </nav>
        <div className="mt-8 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
          Supportive guidance only. For crisis or severe distress, contact trusted people or emergency services.
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-border bg-background/88 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Brand compact />
          <Button variant="ghost" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></Button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 bg-background/95 p-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Brand />
            <Button variant="ghost" aria-label="Close navigation" onClick={() => setOpen(false)}><X className="h-5 w-5" /></Button>
          </div>
          <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
            {nav.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} onClick={() => setOpen(false)} />)}
          </nav>
        </div>
      ) : null}

      <main className="lg:col-start-2">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">MindMate AI</p>
              <h1 className="text-2xl font-black sm:text-3xl">{pageTitle(pathname)}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => updateSettings({ theme: data.settings.theme === "dark" ? "light" : "dark" })} aria-label="Toggle theme">
                <Moon className="h-4 w-4" /> Theme
              </Button>
              {!data.profile ? <Button onClick={() => router.push("/auth")}><LogIn className="h-4 w-4" /> Sign in</Button> : null}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 font-black">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      {!compact ? <span className="text-xl">MindMate AI</span> : null}
    </Link>
  );
}

function NavItem({ href, label, icon: Icon, active, onClick }: { href: string; label: string; icon: LucideIcon; active: boolean; onClick?: () => void }) {
  return (
    <Link onClick={onClick} href={href} className={cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition hover:bg-muted", active && "bg-primary text-primary-foreground hover:bg-primary")}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function pageTitle(pathname: string) {
  const item = nav.find((n) => n.href === pathname);
  return item?.label ?? "MindMate";
}
