import type { Metadata } from "next";
import { MindMateProvider } from "@/hooks/useMindMate";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindMate AI",
  description: "Student mental wellness companion for exam season"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MindMateProvider>
          <AppShell>{children}</AppShell>
        </MindMateProvider>
      </body>
    </html>
  );
}
