export default function PainelLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-background-surface" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-xl border border-border bg-background-surface"
          />
        ))}
      </div>
    </div>
  );
}
