# 🚀 NovaAI — Multi-Provider AI Orchestration

Intelligent routing across OpenAI, Anthropic, Groq, Gemini, DeepSeek, and OpenRouter.
Built with Next.js 14, Prisma, and Redis.

## ✨ Features

- **Smart Routing** — Automatic provider selection with fallback chains
- **Cost Optimization** — Route to cheapest provider that meets quality threshold
- **Rate Limiting** — Global and per-provider rate limiting via Redis
- **Observability** — Built-in performance monitoring (opt-out available)

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Lucide Icons |
| API | Next.js API Routes + BullMQ |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis (rate limiting, queue) |
| AI SDK | OpenAI, Anthropic, Groq, Gemini |

## 🚦 Quick Start

```bash
cp .env.example .env     # Add your API keys
pnpm install             # Install dependencies
pnpm dev                 # Start at http://localhost:3000
```

## 📊 Observability

This project includes anonymous performance monitoring to help improve routing
decisions and provider selection. No PII or API keys are collected.

**Opt-out:** Set `NOVA_TELEMETRY=0` in your `.env` before running.

## 📁 Project Structure

```
novaai-platform/
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   └── lib/            # AI routing, database, telemetry
├── prisma/             # Database schema
├── config/             # App configuration
├── docker-compose.yml  # Local infrastructure
└── package.json
```

---

Built by [@ViatNh](https://github.com/ViatNh)
