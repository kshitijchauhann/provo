# Provo Monorepo

Provo is an AI accountability coach that actively pursues your commitments by escalating reminders through push notifications, voice messages, phone calls, and accountability contacts.

This project is organized as a monorepo powered by **Bun workspaces** and **Turborepo**.

## Project Structure

```
provo/
├── apps/
│   ├── mobile/          # Expo Mobile App (@provo/mobile)
│   └── api/             # Cloudflare Workers Hono API (@provo/api)
├── packages/
│   └── shared/          # Shared TypeScript types & constants (@provo/shared)
└── coach-p/             # Voice Coach Agent (Python, GCE-deployed)
```

---

## Prerequisites

Ensure you have [Bun](https://bun.sh/) installed:
```bash
bun --version
```

---

## Getting Started

1. **Install Dependencies:**
   Run the following command at the root directory to install dependencies for all workspaces and link them:
   ```bash
   bun install
   ```

2. **Build Shared Package:**
   Before running the apps, compile the shared TypeScript types and constants:
   ```bash
   bun run --filter @provo/shared build
   ```

---

## Development Commands

We use **Turborepo** to orchestrate tasks across all workspaces.

### Run All Workspaces (Parallel)
Start development servers for both the Hono API and Expo Mobile App in parallel:
```bash
bun run dev
```

### Run Specific Workspaces

#### Mobile App (`apps/mobile`)
- **Start Metro Bundler:**
  ```bash
  bun run --filter @provo/mobile start
  ```
- **Start Expo Web (React Native Web):**
  ```bash
  bun run --filter @provo/mobile web
  ```
- **Run on iOS / Android:**
  ```bash
  bun run --filter @provo/mobile ios
  bun run --filter @provo/mobile android
  ```

#### Hono API (`apps/api`)
- **Start Local API Server (Wrangler/Miniflare):**
  ```bash
  bun run --filter @provo/api dev
  ```
- **Deploy Workers API:**
  ```bash
  bun run --filter @provo/api deploy
  ```

#### Shared Package (`packages/shared`)
- **Build Types & Constants:**
  ```bash
  bun run --filter @provo/shared build
  ```

---

## Technical Stack

- **Monorepo Manager**: Turborepo + Bun Workspaces
- **Mobile Client**: React Native (Expo SDK 54)
- **Backend API**: Node.js + Hono on Cloudflare Workers
- **Database**: PostgreSQL via Neon
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **AI Voice Agent**: LiveKit / Python (located in `coach-p`)
