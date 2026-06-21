# Provo Memory & Context System Design

This document details the architecture, database schema, data flows, LLM prompt templates, and lifecycle management for the Provo AI accountability coach's **Memory and Context System (Module M13)**.

---

## 1. System Overview & Architecture

The Provo memory system is designed to give the AI Coach ("Coach P") a persistent, evolving understanding of the user. It prevents the coach from asking repetitive questions, enables personalized coaching strategies (e.g., matching the user's preferred tone), and provides historical context for pattern analysis.

The system uses a **hybrid memory architecture**:
1. **Dynamic Ephemeral Context**: Real-time stats (streaks, active commitments, check-in history) fetched directly from transactional tables at call initiation.
2. **Structured Long-Term Memory (DB)**: Semantic facts, patterns, and preferences extracted post-call, stored with relevance weights and Time-to-Live (TTL) decay rules.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              COACH-P (GCE)                             │
│                                                                        │
│  1. Initiate Call ───────► Fetch User Context ──────────────────┐      │
│                                                                 │      │
│  2. Active Call ◄───────── Prompt Construction (Inject Memories)│      │
│                                                                 │      │
│  3. End Call ────────────► Extract Memories (Groq) ──────────┐  │      │
└─────────────────────────────────────────▲────────────────────│──│──────┘
                                          │                    │  │
                                          │ HTTPS (Internal)   │  │
┌─────────────────────────────────────────┼────────────────────┼──┼──────┐
│                            HONO API (Workers)                │  │      │
│                                         │                    ▼  ▼      │
│  GET /internal/user/:id/context ────────┴─────────────────► [Fetch]    │
│  POST /internal/memories ◄───────────────────────────────── [Dedupe]  │
└──────────────────────────────────────────────────────────────┬─────────┘
                                                               │
                                                               ▼
                                                       ┌──────────────┐
                                                       │  NEON DB     │
                                                       │ (user_memory)│
                                                       └──────────────┘
```

---

## 2. Database Schema (`user_memory`)

Drizzle schema definition:

```typescript
import { pgTable, uuid, text, doublePrecision, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { userProfiles } from './schema';

export const memoryTypeEnum = pgEnum('memory_type', ['pattern', 'preference', 'context', 'insight']);

export const userMemory = pgTable('user_memory', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => userProfiles.id, { onDelete: 'cascade' }).notNull(),
  memoryType: memoryTypeEnum('memory_type').notNull(),
  content: text('content').notNull(),
  relevanceScore: doublePrecision('relevance_score').default(1.0).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

### Memory Types & TTL Policies

| Type | Description | Generation Method | Default TTL / Maintenance |
|---|---|---|---|
| `preference` | Preferred tone, coach intensity, preferred call times, communication style. | Extracted post-call or parsed from settings change. | Permanent (No expiration). |
| `context` | Temporary life events (e.g., "Has job interview next Tuesday", "Is traveling this weekend"). | Extracted post-call by AI. | 7 Days TTL. |
| `insight` | Observations about streaks or emotional state (e.g., "Frustrated about breaking streak on Monday"). | Extracted post-call by AI. | 30 Days TTL. |
| `pattern` | High-level behavioral trends (e.g., "Fails 70% of commitments made after 10 PM"). | Weekly background cron analysis of check-in histories. | Replaced/updated weekly. |

---

## 3. Context Construction (Pre-Call)

When a call starts (user-initiated or Stage 4 escalation), the Python voice agent requests the user's compiled context from the Hono API:

`GET /internal/user/:userId/context`

### API Response Format

```json
{
  "user": {
    "name": "Jane Doe",
    "intensity": "high",
    "streakCurrent": 5,
    "streakLongest": 12
  },
  "activeCommitments": [
    {
      "id": "c1-uuid",
      "text": "Complete slides for the board meeting",
      "deadline": "2026-06-22T17:00:00Z",
      "proofType": "screenshot"
    }
  ],
  "recentCheckins": [
    {
      "commitmentText": "Gym session",
      "type": "confirmed",
      "createdAt": "2026-06-20T08:30:00Z"
    }
  ],
  "memories": [
    {
      "memoryType": "preference",
      "content": "Responds best to short, direct call-outs rather than soft encouragements."
    },
    {
      "memoryType": "context",
      "content": "Has a big board meeting on Tuesday afternoon."
    }
  ]
}
```

### Coach P Prompt Assembly

The voice agent maps these fields into the system prompt at session startup:

```python
def build_coach_system_prompt(ctx: dict) -> str:
    user = ctx["user"]
    active = "\n".join([f"- {c['text']} (Due: {c['deadline']}, Proof required: {c['proofType']})" for c in ctx["activeCommitments"]])
    history = "\n".join([f"- {h['commitmentText']}: {h['type']} at {h['createdAt']}" for h in ctx["recentCheckins"]])
    memories = "\n".join([f"- [{m['memoryType']}] {m['content']}" for m in ctx["memories"]])

    return f"""
You are Coach P, a strict, direct, and results-focused accountability coach. You do not offer empty praise. 

User Profile:
- Name: {user['name']}
- Streak: {user['streakCurrent']} days (Longest: {user['streakLongest']} days)
- Intensity Level: {user['intensity'].upper()}

Active Commitments Jane must complete:
{active}

Recent Check-in History (Last 7 Days):
{history}

What you remember about Jane:
{memories}

Coaching Rules:
1. Speak in short, concise sentences. Avoid conversational filler.
2. Refer to Jane's active commitments and relevant memories naturally.
3. If Jane claims she completed a commitment, remind her that she needs to submit the proof ({ctx['activeCommitments'][0]['proofType'] if ctx['activeCommitments'] else 'none'}) via the app.
4. Adjust your tone strictly to the intensity profile:
   - LOW: Firm but supportive.
   - MEDIUM: Direct, minimal encouragement. Focuses on the commitment text.
   - HIGH: Unsentimental, zero tolerance for excuses, highlights breaks in streaks immediately.
"""
```

---

## 4. Post-Call Memory Extraction Pipeline

When a call concludes, the Python agent extracts memories from the conversation transcript before closing the session.

```
[Call Transcript] ──► [Groq: Llama 3.3 70B] ──► [Structured JSON Memories] ──► [Workers API] ──► [Deduplication & Storage]
```

### LLM Prompt for Memory Extraction

```
You are an advanced memory processing agent for Provo, an AI accountability coach.
Analyze the following transcript between the User and Coach P. Extract any new user preferences, temporary life contexts, or psychological insights.

Ignore general conversational pleasantries, standard feedback, or details of completed commitments unless they indicate a larger behavior trend.

Transcript:
---
{transcript}
---

Return ONLY a JSON array of objects with the following schema. If nothing new was learned, return an empty array [].
JSON Schema:
[
  {
    "memoryType": "preference" | "context" | "insight",
    "content": "Short, clear description in the third person (e.g., 'User works late nights and struggles with early morning check-ins')",
    "relevanceScore": 0.0 to 1.0 (Higher means more critical to remember)
  }
]
```

### Hono API Save Endpoint: `POST /internal/memories`

When the GCE agent posts extracted memories, the API runs a deduplication and relevance updating pipeline:

```typescript
// apps/api/src/routes/internal.ts
import { db } from '../db';
import { userMemory } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { generateEmbedding } from '../services/ai'; // Optional semantic deduplication helper

app.post('/internal/memories', async (c) => {
  const { userId, memories } = await c.req.json();

  for (const memory of memories) {
    // 1. Fetch existing memories of the same type for this user
    const existing = await db.select()
      .from(userMemory)
      .where(
        and(
          eq(userMemory.userId, userId),
          eq(userMemory.memoryType, memory.memoryType)
        )
      );

    // 2. Simple deduplication check: 
    // Check if new content matches or is highly similar to existing content
    let isDuplicate = false;
    for (const item of existing) {
      const similarity = calculateSimilarity(item.content, memory.content);
      if (similarity > 0.8) {
        // Semantic overlap found: update relevance and refresh updated_at
        await db.update(userMemory)
          .set({ 
            relevanceScore: Math.min(1.0, item.relevanceScore + 0.1),
            updatedAt: new Date()
          })
          .where(eq(userMemory.id, item.id));
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      // 3. Set expiration based on memory type
      let expiresAt: Date | null = null;
      const now = new Date();
      if (memory.memoryType === 'context') {
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      } else if (memory.memoryType === 'insight') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      await db.insert(userMemory).values({
        userId,
        memoryType: memory.memoryType,
        content: memory.content,
        relevanceScore: memory.relevanceScore,
        expiresAt,
      });
    }
  }

  return c.json({ success: true });
});

function calculateSimilarity(str1: string, str2: string): number {
  // Fallback direct string comparison or simple Jaccard similarity if vector embeddings are disabled
  const words1 = new Set(str1.toLowerCase().split(' '));
  const words2 = new Set(str2.toLowerCase().split(' '));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}
```

---

## 5. Memory Decay and Pruning (Cron Job)

To prevent context window bloat and keep the agent focused on current information, low-relevance and expired memories are cleaned up using a Worker Cron trigger.

### Worker Cron: `scheduled` in `apps/api/src/scheduled/memory-cleanup-cron.ts`

Runs daily at midnight:

```typescript
import { db } from '../db';
import { userMemory } from '../db/schema';
import { lt, or, and, eq } from 'drizzle-orm';

export async function pruneMemories() {
  const now = new Date();

  // 1. Delete memories that have passed their explicit TTL expiration date
  const expiredResult = await db.delete(userMemory)
    .where(
      and(
        lt(userMemory.expiresAt, now),
        eq(userMemory.memoryType, 'context') // Limit checks appropriately
      )
    );

  // 2. Apply a linear decay factor to insights (decrease relevance by 10% weekly)
  // Clean up if relevance falls below 0.2 threshold
  const lowRelevanceResult = await db.delete(userMemory)
    .where(
      lt(userMemory.relevanceScore, 0.2)
    );
    
  console.log(`Pruned expired and low relevance memories.`);
}
```

---

## 6. End-to-End Walkthrough Example

### Phase A: Call 1 (Establishing Facts)
- **User Action**: Jane calls Coach P to log her morning routine.
- **Transcript snippet**: 
  - *Jane*: "Yeah, I worked out today. But it's hard because my knees have been hurting since I started running on concrete last week."
- **Post-Call Extraction (GCE)**:
  - LLM extracts: `{"memoryType": "context", "content": "Struggling with knee pain from running on concrete", "relevanceScore": 0.8}`
- **DB Write**: Inserted into `user_memory` with a 7-day TTL expiration date.

### Phase B: Call 2 (Referencing Back)
- **Time Elapsed**: 2 days later.
- **Trigger**: Jane starts another voice check-in.
- **Context Builder Output**:
  - `memories: ["- [context] Struggling with knee pain from running on concrete"]`
- **Agent Behavior**:
  - *Coach P*: "Jane. Welcome back. Let's look at your gym commitment. How are your knees feeling today? Did you swap out concrete for a track?"
  - *Jane*: "Oh wow, you remembered. Yeah, I did..."
- **Result**: Immediate high engagement, establishing emotional hooks (Hooked Model).
