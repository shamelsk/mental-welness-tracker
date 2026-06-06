import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, body, action, onAction }: { icon: LucideIcon; title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>
      {action && onAction ? <Button className="mt-4" onClick={onAction}>{action}</Button> : null}
    </div>
  );
}
