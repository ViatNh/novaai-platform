import { AI_PROVIDERS, FALLBACK_CHAIN, type ProviderName } from "@/lib/ai-config";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">NovaAI Dashboard</h1>
        <p className="text-sm text-zinc-500">Enterprise AI Orchestration v2.4.1</p>
      </header>

      <section className="grid grid-cols-3 gap-4 p-6">
        {Object.entries(AI_PROVIDERS).map(([name, config]) => (
          <div key={name} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize">{name}</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-sm text-zinc-500">{config.model}</p>
            <p className="mt-2 text-xs text-zinc-600 truncate">{config.baseURL}</p>
          </div>
        ))}
      </section>

      <section className="px-6">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">Fallback Chain</h2>
        <div className="flex gap-2">
          {FALLBACK_CHAIN.map((p, i) => (
            <span key={p} className="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {i + 1}. {p}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
