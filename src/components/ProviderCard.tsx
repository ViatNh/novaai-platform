interface ProviderCardProps {
  name: string;
  model: string;
  status: "active" | "degraded" | "offline";
  latency: number;
}

export function ProviderCard({ name, model, status, latency }: ProviderCardProps) {
  const statusColors = {
    active: "bg-emerald-500",
    degraded: "bg-amber-500",
    offline: "bg-red-500",
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize">{name}</h3>
        <span className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
      </div>
      <p className="mt-1 text-sm text-zinc-400">{model}</p>
      <p className="mt-2 text-xs text-zinc-600">{latency}ms avg</p>
    </div>
  );
}
