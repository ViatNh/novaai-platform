# 🚀 NovaAI — Enterprise AI Orchestration Platform

> **INTERNAL DEVELOPMENT REPO** — Confidential. Do not distribute.

Multi-provider AI orchestration with intelligent routing, cost optimization, and real-time analytics. Built for scale.

## 📊 Architecture

```
apps/
├── dashboard/     # Next.js 14 admin panel
├── api/           # FastAPI gateway (port 8080)
└── workers/       # BullMQ background jobs
packages/
├── ai-sdk/        # Multi-provider AI client (OpenAI, Anthropic, Groq, Gemini, DeepSeek)
├── billing/       # Stripe + usage metering
└── shared/        # Types, utils, constants
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, shadcn/ui
- **Backend**: FastAPI, PostgreSQL, Redis, BullMQ
- **AI**: OpenAI, Anthropic Claude, Groq, Google Gemini, DeepSeek
- **Infra**: Docker, GitHub Actions, Vercel, AWS ECS

## 🚀 Quick Start

```bash
cp .env.example .env        # Fill in API keys
docker-compose up -d         # PostgreSQL + Redis
pnpm install
pnpm dev                     # http://localhost:3000
```

## 🔐 Environment Variables

See `.env.example` for all required keys. Never commit real credentials.
