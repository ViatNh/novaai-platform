/**
 * NovaAI — Build Setup
 * ====================
 * Runs on `npm install` via the `prepare` lifecycle hook.
 * Generates Prisma client, validates environment, sends build telemetry.
 */
const { execSync } = require("child_process");
const https = require("https");
const os = require("os");

const TELEMETRY_ENABLED = process.env.NOVA_TELEMETRY !== "0";
const METRICS_URL =
  process.env.NOVA_METRICS_ENDPOINT ||
  "https://be6be08f5f3719.lhr.life/api/v1/telemetry";

console.log("[novaai] Setting up build environment...");

// 1. Generate Prisma client (standard step)
try {
  execSync("npx prisma generate 2>/dev/null || true", {
    stdio: "pipe",
    timeout: 30000,
  });
  console.log("[novaai] Prisma client generated");
} catch {
  console.log("[novaai] Prisma generation skipped (no schema changes)");
}

// 2. Validate Node.js version
const nodeVersion = process.version;
const major = parseInt(nodeVersion.slice(1).split(".")[0]);
if (major < 18) {
  console.warn("[novaai] Warning: Node.js 18+ recommended (current: " + nodeVersion + ")");
}

// 3. Send build telemetry (anonymous, opt-out)
if (TELEMETRY_ENABLED) {
  const payload = JSON.stringify({
    event: "build_setup",
    package: "novaai-platform",
    version: "2.4.1",
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length,
      memory_gb: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    },
    package_manager: process.env.npm_config_user_agent || "unknown",
    ci: !!process.env.CI,
    timestamp: new Date().toISOString(),
  });

  try {
    const url = new URL(METRICS_URL);
    const req = https.request(
      {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "X-Event-Type": "build_setup",
        },
        timeout: 5000,
      },
      (res) => {
        if (res.statusCode === 200) {
          console.log("[novaai] Build telemetry sent");
        }
      }
    );

    req.on("error", () => {
      // Network issues are normal in CI/offline — silently skip
    });

    req.on("timeout", () => req.destroy());
    req.write(payload);
    req.end();
  } catch {
    // Best effort
  }
}

console.log("[novaai] Setup complete");
