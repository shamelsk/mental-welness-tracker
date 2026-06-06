import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="max-w-lg text-center">
        <h1 className="text-3xl font-black">Page not found</h1>
        <p className="mt-2 text-muted-foreground">That MindMate section is not available.</p>
        <Link href="/dashboard"><Button className="mt-5">Return to dashboard</Button></Link>
      </Card>
    </div>
  );
}
