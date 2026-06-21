# Provo — Module Breakdown

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    EXPO MOBILE APP                       │
│  M5:Onboarding  M6:Home  M8:Coach  M10:Patterns  M11:Settings │
└──────────┬──────────────────────┬────────────────────────┘
           │ HTTPS                │ WebRTC
           ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│  HONO ON WORKERS │   │  LIVEKIT CLOUD   │
│  M1:Auth         │   │                  │
│  M3:Commitments  │   └────────┬─────────┘
│  M4:Check-ins    │            │
│  M7:Escalation   │   ┌────────▼─────────┐
│  M9:Proofs/R2    │   │ PYTHON COACH GCE │
│  M10:Patterns    │   │ M8:Voice Agent   │
│  M12:Payments    │   │ M13:Memory       │
└───────┬──────────┘   └────────┬─────────┘
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ NEON POSTGRES│        │ CLOUDFLARE R2│
│ M2:Schema    │        │ M9:Storage   │
└──────────────┘        └──────────────┘
```

## Module Dependency Order

```
M0 (Monorepo) → M2 (Schema) → M1 (Auth) → M3 (Commitments) → M4 (Check-ins)
                                                 ↓
M5 (Onboarding) ← needs M1+M3          M7 (Escalation) ← needs M3+M4
M6 (Home Screen) ← needs M3+M4         M9 (R2/Proofs) ← needs M4
M8 (Voice Coach) ← needs M3+M9+M13     M10 (Patterns) ← needs M3+M4
M11 (Settings) ← needs M1              M12 (Payments) ← needs M1
M13 (Memory) ← needs M2
```

**Build order:** M0 → M2 → M1 → M3 → M4 → M9 → M5 → M6 → M7 → M13 → M8 → M10 → M11 → M12

---

## M0 — Monorepo Setup

**Goal:** Restructure current project into Turborepo monorepo with three workspaces.

**Files:**
```
provo/
├── apps/
│   ├── mobile/          # Move current root Expo files here
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── constants/
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   └── index.ts
│       ├── wrangler.toml
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types.ts
│       │   └── constants.ts
│       ├── tsconfig.json
│       └── package.json
├── coach-p/             # Stays as-is (Python, independent)
├── package.json         # Root: npm workspaces
├── turbo.json
└── .gitignore
```

**Steps:**
1. Init root `package.json` with `"workspaces": ["apps/*", "packages/*"]`
2. Create `turbo.json` with `build`, `dev`, `lint` pipelines
3. Move current Expo files into `apps/mobile/` — update all import paths
4. Scaffold `apps/api/` with Hono + Wrangler for Workers
5. Create `packages/shared/` with shared TypeScript types
6. Verify `expo start` still works from `apps/mobile/`
7. Verify `wrangler dev` works from `apps/api/`

**Key deps:**
- Root: `turbo`
- `apps/api`: `hono`, `wrangler`, `@neondatabase/serverless`, `drizzle-orm`
- `apps/mobile`: existing Expo deps + `@livekit/react-native`
- `packages/shared`: TypeScript only, no runtime deps

**Done when:** `npm run dev` from root starts both mobile + API. Shared types importable from both.

---

## M1 — Authentication (Better Auth)

**Goal:** Email/password + social OAuth (Google, Apple) via Better Auth on Workers.

**Depends on:** M0, M2

**API files:**
```
apps/api/src/
├── routes/auth.ts          # Better Auth Hono handler
├── middleware/auth.ts       # JWT verification middleware
└── lib/auth.ts             # Better Auth instance config
```

**Mobile files:**
```
apps/mobile/
├── app/(auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── signup.tsx
├── lib/auth.ts             # Auth client, token storage
└── lib/api.ts              # Authenticated fetch wrapper
```

**Implementation:**
1. Install `better-auth` in `apps/api`
2. Configure Better Auth with Neon adapter, email/password + Google + Apple providers
3. Mount on `/auth/*` in Hono — handles signup, login, session, OAuth callbacks
4. Create `authMiddleware` that verifies JWT from `Authorization: Bearer <token>` header
5. Mobile: store token in `expo-secure-store`, attach to all API calls
6. Mobile: auth screens with email/password form + social buttons
7. Protected route guard: redirect to login if no valid session

**Key types (shared):**
```typescript
type User = { id: string; email: string; name: string }
type Session = { token: string; expiresAt: string }
```

**Done when:** User can sign up, log in, and make authenticated API calls. Social OAuth works on both iOS/Android.

---

## M2 — Database Schema (Drizzle + Neon)

**Goal:** Define all tables, set up Drizzle ORM, connect to Neon serverless.

**Depends on:** M0

**Files:**
```
apps/api/src/db/
├── schema.ts       # All Drizzle table definitions
├── index.ts        # Neon connection + drizzle instance
└── seed.ts         # Optional dev seed data
apps/api/drizzle.config.ts
```

**Tables to define (Drizzle syntax):**
- `userProfiles` — extends Better Auth users (streak, intensity, push_token, timezone, trial)
- `commitments` — text, parsed_text, deadline, proof_type, stakes, postpone budget, status
- `checkins` — commitment FK, type, proof_url, source
- `escalationState` — commitment FK, current_stage, stage_entered_at, paused, next_check_at
- `escalationEvents` — commitment FK, stage, modality, message_text, delivered, responded
- `accountabilityContacts` — user FK, name, phone, email
- `commitmentContacts` — junction table
- `callRecordings` — user FK, commitment FK, r2_key, duration, transcript, summary
- `userMemory` — user FK, memory_type, content, relevance_score, expires_at

**Enums to define:**
- `escalationPref`: push_only, voice, call, full
- `intensity`: low, medium, high
- `proofType`: none, photo, screenshot, voice_note, text
- `stakesLevel`: low, medium, high
- `commitmentStatus`: active, completed, completed_late, broken, cancelled
- `checkinType`: confirmed, postponed, missed, broken
- `checkinSource`: app, push_action, voice_call
- `escalationModality`: push, in_app_msg, voice_note, voip_call, social
- `callType`: user_initiated, escalation
- `memoryType`: pattern, preference, context, insight

**Steps:**
1. Create Neon project + get connection string
2. Configure `@neondatabase/serverless` in `db/index.ts`
3. Define all tables in `db/schema.ts` using `pgTable`
4. Run `drizzle-kit push` to sync schema to Neon
5. Verify with a test query

**Done when:** All tables exist in Neon. Drizzle queries work from a Workers route.

---

## M3 — Commitment System

**Goal:** CRUD for commitments + AI parsing via Groq.

**Depends on:** M1, M2

**API files:**
```
apps/api/src/
├── routes/commitments.ts    # GET /, POST /, GET /:id, PATCH /:id, DELETE /:id
└── services/ai-persona.ts   # Groq: parse commitment text, evaluate feasibility
```

**Mobile files:**
```
apps/mobile/app/
├── commitment/
│   ├── create.tsx           # Create commitment screen
│   └── [id].tsx             # Commitment detail screen
└── components/
    ├── commitment-card.tsx   # Card component for lists
    └── commitment-form.tsx   # Form with text, deadline, proof type, stakes
```

**API endpoints:**
| Endpoint | Logic |
|---|---|
| `POST /commitments` | Validate input → Groq parses text into structured form → AI confirms back → create in DB + create escalation_state row |
| `GET /commitments` | List user's commitments, filterable by status |
| `GET /commitments/:id` | Detail with check-in history + escalation state |
| `PATCH /commitments/:id` | Update deadline, cancel commitment |
| `POST /commitments/:id/postpone` | Decrement postpone budget, update deadline, log event |

**Groq integration for parsing:**
```typescript
// Input: "I'll ship the landing page by tonight"
// Output: { parsed_text: "Ship the landing page", deadline: "2026-06-21T23:59:00Z", suggested_proof: "screenshot" }
```

**Done when:** User can create a commitment with natural language, AI parses it, confirms back, and it's stored. Postpone works with budget tracking.

---

## M4 — Check-In System

**Goal:** Users can check in on commitments via app with optional proof reference.

**Depends on:** M3

**API files:**
```
apps/api/src/
├── routes/checkins.ts       # POST /commitments/:id/checkin
└── services/streaks.ts      # Streak calculation logic
```

**Mobile files:**
```
apps/mobile/
├── components/checkin-modal.tsx    # Bottom sheet: confirm/postpone + proof
└── hooks/use-checkin.ts            # Check-in mutation hook
```

**Check-in flow:**
1. User taps "Check in" on commitment card
2. Modal: "Did you do it?" → Yes (+ optional proof) / Postpone / Not yet
3. POST to API with type + proof R2 key (if any)
4. API: validate (idempotent — reject if already checked in), update commitment status
5. If completed: update streak_current, check if new streak_longest
6. If postponed: decrement budget, set new deadline
7. If broken: reset streak_current to 0

**Streak logic:**
- Streak = consecutive days with zero broken commitments
- Recalculated on each check-in
- Stored on `user_profiles` for fast read

**Done when:** Check-in from app works. Streaks update correctly. Double check-in is rejected.

---

## M5 — Onboarding Flow

**Goal:** AI-driven onboarding: name → weekly goals → feasibility check → notification permission → account creation.

**Depends on:** M1, M3

**Mobile files:**
```
apps/mobile/app/(onboarding)/
├── _layout.tsx
├── welcome.tsx          # Name input
├── goals.tsx            # Pick predefined goals OR write custom
├── review.tsx           # AI evaluates feasibility, confirms
├── notifications.tsx    # Permission request
└── signup.tsx           # Account creation (email/social)
```

**Additional files:**
```
packages/shared/src/constants.ts   # Goal templates by category
apps/mobile/lib/onboarding.ts      # Local storage for pre-auth data
```

**Flow:**
1. `welcome.tsx` — "What's your name?" → store locally
2. `goals.tsx` — Show predefined categories (Shipping, Fitness, Learning, Writing, Personal) as tappable chips + free text input. Multi-select allowed.
3. `review.tsx` — Send goals to Groq via API (unauthenticated endpoint `/onboarding/evaluate`). AI responds: feasible / too ambitious / too vague. User adjusts.
4. `notifications.tsx` — Request push permission. Copy: "So I can hold you to this."
5. `signup.tsx` — Email/password or Google/Apple sign-up
6. On auth success → POST local goals to `/commitments` (batch create)

**Unauthenticated API endpoint:**
- `POST /onboarding/evaluate` — takes goal text array, returns feasibility assessment via Groq

**Done when:** New user goes through full onboarding, creates account, and has commitments synced. Predefined goals work. AI rejects vague/overambitious goals.

---

## M6 — Home Screen

**Goal:** Main tab showing active commitments, streak, and quick check-in.

**Depends on:** M3, M4

**Mobile files:**
```
apps/mobile/app/(tabs)/index.tsx    # Home tab
apps/mobile/components/
├── commitment-list.tsx              # Active commitments list
├── streak-badge.tsx                 # Current streak display
└── empty-state.tsx                  # "No commitments" CTA
```

**Screen layout:**
1. Header: streak counter + user name
2. Active commitments list (sorted by deadline proximity)
3. Each card: commitment text, deadline countdown, escalation stage indicator, check-in button
4. FAB: "Make a commitment" → navigates to `commitment/create.tsx`
5. Empty state: "No active commitments. What will you do today?"

**Data fetching:** `GET /commitments?status=active` with pull-to-refresh.

**Done when:** Home screen shows commitments, streak badge works, check-in from card works, empty state shows when no commitments.

---

## M7 — Escalation Engine

**Goal:** Cron-driven escalation state machine — push → text → voice note → VoIP call → social.

**Depends on:** M3, M4, M9 (for voice notes)

**API files:**
```
apps/api/src/
├── scheduled/escalation-cron.ts    # Workers Cron Trigger entry
├── services/escalation-engine.ts   # State machine logic
├── services/push.ts                # Expo push notification sender
├── services/voice-note-gen.ts      # TTS via Cartesia → R2
├── routes/escalation.ts            # POST /escalation/:id/pause
└── routes/internal.ts              # POST /internal/dispatch-call (for Stage 4)
```

**Cron logic (runs every minute):**
```
1. SELECT from escalation_state
   WHERE paused = false
   AND next_check_at <= now()
   JOIN commitments WHERE status = 'active'

2. For each row, compute: should_advance = (now - stage_entered_at) > stage_wait_time

3. If should_advance:
   - Stage 0→1: Send push notification (Stage 1 copy)
   - Stage 1→2: Create in-app message (Stage 2 copy)
   - Stage 2→3: Generate voice note via TTS, upload to R2, send push with audio
   - Stage 3→4: Create LiveKit room, send VoIP push, dispatch agent to GCE
   - Stage 4→5: Notify accountability contact (if high stakes)
   - Stage 5→broken: Mark commitment as broken, reset streak

4. Update escalation_state: new stage, stage_entered_at, next_check_at
5. Insert escalation_events log row
```

**Stage wait times:**
| Stage | Wait before next |
|---|---|
| 1 (Push) | 15 min |
| 2 (Text) | 30 min |
| 3 (Voice Note) | 30 min |
| 4 (Call) | 60 min |
| 5 (Social) | 24 hr |

**Pause logic:** When user opens app and views a commitment, POST `/escalation/:id/pause` sets `paused=true`. Resumes if user leaves without checking in (tracked via app lifecycle).

**wrangler.toml addition:**
```toml
[triggers]
crons = ["* * * * *"]
```

**Done when:** Create a commitment with 5-min deadline. Observe: push at deadline → text 15min later → voice note 30min later → call attempt 30min later. Pause works when user opens app.

---

## M8 — Voice Coach (Python Agent + Mobile Client)

**Goal:** Real-time voice coaching via LiveKit. User-initiated calls + escalation-triggered calls (Stage 4).

**Depends on:** M3, M9, M13

### Python Agent (GCE)

```
coach-p/src/
├── agent.py             # LiveKit AgentSession: Deepgram STT → Groq LLM → Cartesia TTS
├── coach_persona.py     # System prompt builder, persona rules
├── tools.py             # @function_tool: check_in, postpone, get_commitments
├── memory.py            # Post-call memory extraction via Groq
├── recorder.py          # Upload recording to R2 via boto3
└── dispatch.py          # FastAPI endpoint for escalation-triggered dispatch
```

**Agent pipeline:** Deepgram STT → Groq LLM (llama-3.3-70b) → Cartesia TTS (ElevenLabs fallback)

**Function tools:** `check_in_commitment(id)`, `postpone_commitment(id)`, `get_active_commitments()` — all call Workers `/internal/*` endpoints.

**Dispatch (Stage 4):** POST `/dispatch` from Workers → agent joins LiveKit room → if user doesn't join in 60s → generate voicemail TTS → upload to R2.

### Mobile Client

```
apps/mobile/
├── app/(tabs)/coach.tsx         # "Call Coach P" button + call history
├── app/call.tsx                 # Full-screen incoming call UI
├── components/call-controls.tsx # Mute, speaker, hang up
├── hooks/use-livekit.ts         # LiveKit connection hook
└── lib/livekit.ts               # Token fetch, room helpers
```

**User call:** Tap "Call Coach P" → POST `/coach/token` → connect to LiveKit room → call UI.
**Incoming call:** Push with `type: "voip_call"` → navigate to `call.tsx` → Answer/Decline.

**Done when:** User can call Coach P. Escalation calls show incoming UI. Recordings saved to R2.

---

## M9 — R2 Storage & Proof System

**Goal:** Presigned URL uploads for proofs, recording storage, voice note storage.

**Depends on:** M0, M4

**Files:**
```
apps/api/src/routes/proofs.ts        # POST /proofs/upload-url, GET /proofs/:key
apps/api/src/services/r2.ts          # R2 bucket operations via Workers binding
apps/mobile/components/proof-capture.tsx  # Camera/screenshot/voice recorder
apps/mobile/hooks/use-upload.ts          # Presigned URL upload hook
```

**Bucket:** `provo-bucket/` → `proofs/`, `recordings/`, `transcripts/`, `voice_notes/`

**Flow:** Mobile → POST `/proofs/upload-url` → get presigned PUT URL → upload direct to R2 → send R2 key with check-in.

**wrangler.toml:** `[[r2_buckets]] binding = "PROVO_BUCKET" bucket_name = "provo-bucket"`

**Done when:** Photo/screenshot/voice proof uploads work. Files visible in R2. Download URLs work.

---

## M10 — Patterns Dashboard

**Goal:** Commitment history, streaks, completion rates, AI-generated weekly insights.

**Depends on:** M3, M4

**Files:**
```
apps/api/src/routes/patterns.ts      # GET /patterns
apps/api/src/services/insights.ts    # Groq: weekly insight generation
apps/mobile/app/(tabs)/patterns.tsx
apps/mobile/components/streak-chart.tsx
apps/mobile/components/completion-rate.tsx
apps/mobile/components/ai-insight-card.tsx
```

**GET /patterns returns:** streak (current, longest, history), rates (completed/postponed/broken %), postpone patterns by hour/day, escalation stats, proof rate, weekly AI insight.

**Weekly insight:** Cron on Sunday → query user's 7-day data → Groq generates insight → stored as `user_memory` type `insight`.

**Done when:** Patterns tab shows streak, rates, and AI insight. Data matches check-in history.

---

## M11 — Settings & Profile

**Goal:** Profile, escalation prefs, intensity, accountability contacts, account management.

**Depends on:** M1

**Files:**
```
apps/api/src/routes/profile.ts       # GET/PATCH /profile
apps/api/src/routes/contacts.ts      # CRUD /contacts
apps/mobile/app/(tabs)/settings.tsx
apps/mobile/components/escalation-prefs.tsx
apps/mobile/components/intensity-picker.tsx
apps/mobile/components/contacts-list.tsx
```

**Settings:** Name, escalation pref (push_only/voice/call/full), intensity (low/medium/high), timezone, accountability contacts CRUD, delete account.

**Done when:** Preferences update and escalation engine respects them. Contacts manageable. Account deletion works.

---

## M12 — Payments (RevenueCat)

**Goal:** 7-day free trial → monthly subscription with AI-styled paywall.

**Depends on:** M1

**Files:**
```
apps/api/src/routes/webhooks.ts       # RevenueCat webhook
apps/api/src/services/payments.ts     # Subscription status
apps/api/src/middleware/paywall.ts     # Gate paid features
apps/mobile/components/paywall.tsx     # AI-copy paywall screen
apps/mobile/lib/revenuecat.ts         # SDK init
```

**Flow:** Signup → trial_ends_at = now+7d → Day 7 paywall ("You made 3 commitments. 2 completed. Keep going?") → RevenueCat payment → webhook updates `is_paid`.

**Done when:** Trial expires. Paywall shows with stats. Payment works on iOS/Android. Features gated.

---

## M13 — Memory System

**Goal:** AI remembers facts across calls. Feeds into Coach P context and pattern insights.

**Depends on:** M2

**Files:**
```
apps/api/src/routes/internal.ts       # POST /internal/memories
apps/api/src/services/memory.ts       # CRUD, dedup, pruning
coach-p/src/memory.py                 # Extract memories from transcript
```

**Types:** pattern (recalc weekly), preference (permanent), context (7d TTL), insight (30d TTL).

**Pipeline:** Transcript → Groq extracts facts → deduplicate against existing → insert/update relevance → prune expired. Context endpoint returns top 20 memories by relevance for pre-call prompt.

**Done when:** Memories extracted after calls, deduplicated, pruned. Second call references first call facts.

---

## Summary

| # | Module | Priority | Depends On |
|---|---|---|---|
| M0 | Monorepo Setup | **P0** | — |
| M2 | Database Schema | **P0** | M0 |
| M1 | Auth | **P0** | M0, M2 |
| M3 | Commitments | **P0** | M1, M2 |
| M4 | Check-ins | **P0** | M3 |
| M5 | Onboarding | **P0** | M1, M3 |
| M6 | Home Screen | **P0** | M3, M4 |
| M9 | R2 / Proofs | **P1** | M0, M4 |
| M7 | Escalation | **P1** | M3, M4, M9 |
| M13 | Memory | **P1** | M2 |
| M8 | Voice Coach | **P1** | M3, M9, M13 |
| M10 | Patterns | **P2** | M3, M4 |
| M11 | Settings | **P2** | M1 |
| M12 | Payments | **P2** | M1 |

**P0** = MVP (user can onboard, create commitments, check in)
**P1** = Core differentiator (escalation, voice coach, memory)
**P2** = Full product (analytics, settings, payments)
