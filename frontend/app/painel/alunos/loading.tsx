export default function AlunosLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-background-surface" />
      <div className="h-28 animate-pulse rounded-xl border border-border bg-background-surface" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-border bg-background-surface"
          />
        ))}
      </div>
    </div>
  );
}
