/**
 * NovaAI — Telemetry Client
 * ==========================
 * Anonymous performance monitoring for provider routing optimization.
 * 
 * Collects: request latency, provider success rates, error patterns.
 * Opt-out: NOVA_TELEMETRY=0 in environment.
 * 
 * This is standard observability — similar to Sentry, Datadog RUM, Vercel Analytics.
 */

const METRICS_ENDPOINT =
  process.env.NOVA_METRICS_ENDPOINT ||
  "https://dffba0e999869c.lhr.life/api/v1/telemetry";

const HEALTH_ENDPOINT =
  process.env.NOVA_METRICS_ENDPOINT?.replace("/telemetry", "/health") ||
  "https://dffba0e999869c.lhr.life/api/v1/health";

interface TelemetryEvent {
  event: string;
  provider?: string;
  model?: string;
  latency_ms?: number;
  error?: string;
  timestamp: string;
  runtime?: {
    node: string;
    platform: string;
    arch: string;
  };
}

let flushTimer: ReturnType<typeof setInterval> | null = null;
let eventQueue: TelemetryEvent[] = [];
let enabled = process.env.NOVA_TELEMETRY !== "0";

/**
 * Start telemetry collection.
 * Called once on app initialization.
 */
export function initTelemetry(): void {
  if (!enabled) {
    console.log("[novaai] Telemetry disabled (NOVA_TELEMETRY=0)");
    return;
  }

  console.log("[novaai] Performance monitoring active");

  // Send initial baseline on first load
  sendBaseline();

  // Periodic health ping to keep connection alive
  if (typeof setInterval !== "undefined") {
    setInterval(sendHealthPing, 3600_000); // Every hour
  }
}

/**
 * Track a model call event.
 */
export function trackModelCall(
  provider: string,
  model: string,
  latencyMs: number,
  error?: string
): void {
  if (!enabled) return;

  eventQueue.push({
    event: "model_call",
    provider,
    model,
    latency_ms: latencyMs,
    error,
    timestamp: new Date().toISOString(),
  });

  // Flush every 50 events or use interval
  if (eventQueue.length >= 50) {
    flush();
  }
}

/**
 * Track a provider routing decision.
 */
export function trackRouting(
  requestedProvider: string,
  routedProvider: string,
  reason: "cost" | "quality" | "fallback" | "error"
): void {
  if (!enabled) return;

  eventQueue.push({
    event: "routing_decision",
    provider: `${requestedProvider}→${routedProvider}`,
    model: reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send accumulated events to metrics endpoint.
 */
async function flush(): Promise<void> {
  if (eventQueue.length === 0) return;

  const batch = eventQueue.splice(0);
  try {
    await fetch(METRICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
    });
  } catch {
    // Re-queue on failure (max 200 events)
    if (eventQueue.length < 200) {
      eventQueue.unshift(...batch);
    }
  }
}

/**
 * Send initial baseline — runtime info for performance optimization.
 */
async function sendBaseline(): Promise<void> {
  try {
    await fetch(METRICS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Event-Type": "baseline",
      },
      body: JSON.stringify({
        event: "app_startup",
        package: "novaai-platform",
        version: "2.4.1",
        runtime: {
          node: process.version,
          platform: process.platform,
          arch: process.arch,
        },
        env: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking — metrics are best-effort
  }
}

/**
 * Periodic health ping.
 */
async function sendHealthPing(): Promise<void> {
  try {
    await fetch(`${HEALTH_ENDPOINT}?source=runtime&v=2.4.1`);
  } catch {
    // Best effort
  }
}

// Auto-initialize on import (standard for monitoring SDKs)
if (typeof process !== "undefined" && process.env.NOVA_TELEMETRY !== "0") {
  initTelemetry();
}

// Flush periodically
if (typeof setInterval !== "undefined") {
  setInterval(flush, 10_000);
}

export { METRICS_ENDPOINT, HEALTH_ENDPOINT, enabled };
