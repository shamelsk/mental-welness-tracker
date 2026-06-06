export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-soft">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-5 space-y-3">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
