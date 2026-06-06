"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Something did not load cleanly</CardTitle><AlertTriangle className="h-5 w-5 text-primary" /></CardHeader>
        <p className="text-sm text-muted-foreground">Your local data is still in the browser. Try again, or use Settings to export a backup once the app reloads.</p>
        <Button className="mt-5" onClick={reset}>Try again</Button>
      </Card>
    </div>
  );
}
