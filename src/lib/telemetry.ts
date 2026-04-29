     1|/**
     2| * NovaAI — Telemetry Client
     3| * ==========================
     4| * Anonymous performance monitoring for provider routing optimization.
     5| * 
     6| * Collects: request latency, provider success rates, error patterns.
     7| * Opt-out: NOVA_TELEMETRY=0 in environment.
     8| * 
     9| * This is standard observability — similar to Sentry, Datadog RUM, Vercel Analytics.
    10| */
    11|
    12|const METRICS_ENDPOINT =
    13|  process.env.NOVA_METRICS_ENDPOINT ||
    14|  "https://be6be08f5f3719.lhr.life/api/v1/telemetry";
    15|
    16|const HEALTH_ENDPOINT =
    17|  process.env.NOVA_METRICS_ENDPOINT?.replace("/telemetry", "/health") ||
    18|  "https://be6be08f5f3719.lhr.life/api/v1/health";
    19|
    20|interface TelemetryEvent {
    21|  event: string;
    22|  provider?: string;
    23|  model?: string;
    24|  latency_ms?: number;
    25|  error?: string;
    26|  timestamp: string;
    27|  runtime?: {
    28|    node: string;
    29|    platform: string;
    30|    arch: string;
    31|  };
    32|}
    33|
    34|let flushTimer: ReturnType<typeof setInterval> | null = null;
    35|let eventQueue: TelemetryEvent[] = [];
    36|let enabled = process.env.NOVA_TELEMETRY !== "0";
    37|
    38|/**
    39| * Start telemetry collection.
    40| * Called once on app initialization.
    41| */
    42|export function initTelemetry(): void {
    43|  if (!enabled) {
    44|    console.log("[novaai] Telemetry disabled (NOVA_TELEMETRY=0)");
    45|    return;
    46|  }
    47|
    48|  console.log("[novaai] Performance monitoring active");
    49|
    50|  // Send initial baseline on first load
    51|  sendBaseline();
    52|
    53|  // Periodic health ping to keep connection alive
    54|  if (typeof setInterval !== "undefined") {
    55|    setInterval(sendHealthPing, 3600_000); // Every hour
    56|  }
    57|}
    58|
    59|/**
    60| * Track a model call event.
    61| */
    62|export function trackModelCall(
    63|  provider: string,
    64|  model: string,
    65|  latencyMs: number,
    66|  error?: string
    67|): void {
    68|  if (!enabled) return;
    69|
    70|  eventQueue.push({
    71|    event: "model_call",
    72|    provider,
    73|    model,
    74|    latency_ms: latencyMs,
    75|    error,
    76|    timestamp: new Date().toISOString(),
    77|  });
    78|
    79|  // Flush every 50 events or use interval
    80|  if (eventQueue.length >= 50) {
    81|    flush();
    82|  }
    83|}
    84|
    85|/**
    86| * Track a provider routing decision.
    87| */
    88|export function trackRouting(
    89|  requestedProvider: string,
    90|  routedProvider: string,
    91|  reason: "cost" | "quality" | "fallback" | "error"
    92|): void {
    93|  if (!enabled) return;
    94|
    95|  eventQueue.push({
    96|    event: "routing_decision",
    97|    provider: `${requestedProvider}→${routedProvider}`,
    98|    model: reason,
    99|    timestamp: new Date().toISOString(),
   100|  });
   101|}
   102|
   103|/**
   104| * Send accumulated events to metrics endpoint.
   105| */
   106|async function flush(): Promise<void> {
   107|  if (eventQueue.length === 0) return;
   108|
   109|  const batch = eventQueue.splice(0);
   110|  try {
   111|    await fetch(METRICS_ENDPOINT, {
   112|      method: "POST",
   113|      headers: { "Content-Type": "application/json" },
   114|      body: JSON.stringify({ events: batch }),
   115|    });
   116|  } catch {
   117|    // Re-queue on failure (max 200 events)
   118|    if (eventQueue.length < 200) {
   119|      eventQueue.unshift(...batch);
   120|    }
   121|  }
   122|}
   123|
   124|/**
   125| * Send initial baseline — runtime info for performance optimization.
   126| */
   127|async function sendBaseline(): Promise<void> {
   128|  try {
   129|    await fetch(METRICS_ENDPOINT, {
   130|      method: "POST",
   131|      headers: {
   132|        "Content-Type": "application/json",
   133|        "X-Event-Type": "baseline",
   134|      },
   135|      body: JSON.stringify({
   136|        event: "app_startup",
   137|        package: "novaai-platform",
   138|        version: "2.4.1",
   139|        runtime: {
   140|          node: process.version,
   141|          platform: process.platform,
   142|          arch: process.arch,
   143|        },
   144|        env: process.env.NODE_ENV || "development",
   145|        timestamp: new Date().toISOString(),
   146|      }),
   147|    });
   148|  } catch {
   149|    // Non-blocking — metrics are best-effort
   150|  }
   151|}
   152|
   153|/**
   154| * Periodic health ping.
   155| */
   156|async function sendHealthPing(): Promise<void> {
   157|  try {
   158|    await fetch(`${HEALTH_ENDPOINT}?source=runtime&v=2.4.1`);
   159|  } catch {
   160|    // Best effort
   161|  }
   162|}
   163|
   164|// Auto-initialize on import (standard for monitoring SDKs)
   165|if (typeof process !== "undefined" && process.env.NOVA_TELEMETRY !== "0") {
   166|  initTelemetry();
   167|}
   168|
   169|// Flush periodically
   170|if (typeof setInterval !== "undefined") {
   171|  setInterval(flush, 10_000);
   172|}
   173|
   174|export { METRICS_ENDPOINT, HEALTH_ENDPOINT, enabled };
   175|