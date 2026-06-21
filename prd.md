**PROVO**

Product Requirements Document

_AI Accountability Coach - v1.0_

**Status:** Draft **Version:** 1.0 **Date:** June 2026

**Author:** Kshitij **Platform:** iOS + Android (React Native)

| **One-line pitch**                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provo is an AI accountability coach that doesn't wait for you to show up - it actively pursues the commitments you made, escalating through messages, voice notes, and phone calls until you follow through or explain why you didn't. |

# **1\. Problem Statement**

Most people struggle not with setting goals, but with following through. The market is saturated with tools that help users organize tasks and track habits - but virtually none that hold users accountable once they disappear. The core failure mode is this: users feel motivated when they open the app. They don't open the app when motivation is lowest. So the app never reaches them when it matters most.

**The gap we're filling**

- Existing accountability apps are passive - they wait for the user to check in.
- Commitment psychology research shows external social pressure significantly improves follow-through rates.
- Voice-based communication carries urgency that push notifications have lost through habituation.
- Users routinely ghosting apps is not a UX failure - it's an architecture failure. The app should come to them.

| **Core insight**                                                                                  |
| ------------------------------------------------------------------------------------------------- |
| The problem isn't that people don't know what to do. It's that no one is watching.                |
| Provo changes that. It watches. It remembers. It escalates. It doesn't let you quietly disappear. |

# **2\. Product Vision**

Provo is an AI accountability engine built around one principle: commitments you make to Provo are treated as real. The AI tracks every promise, remembers every deadline, monitors every postponement, and escalates contact when users go silent - moving from notification to message to voice note to actual phone call.

Unlike productivity apps (which help users organize) or habit trackers (which log behavior), Provo exists to ensure follow-through. It is proactive, not passive. It pursues, not waits.

**Design philosophy**

- Commitments, not tasks - framing shifts ownership and psychological weight.
- The AI speaks first - Provo initiates contact, not the user.
- Escalation is the product - the escalation protocol is the core differentiator, not the interface.
- Investment compounds - the more you use Provo, the more it knows, and the harder it is to leave.
- Proof over claims - check-ins without evidence are treated as incomplete.

# **3\. Target User**

Provo is built for anyone who has repeatedly told themselves they'll do something and then didn't. It is deliberately broad at launch, allowing organic discovery to reveal the primary cohort. Initial hypothesis: the product will index toward high-agency individuals who are self-aware about their follow-through problem and motivated enough to want external pressure.

**User segments likely to resonate strongly**

| **Segment**                   | **Core pain**                                                        | **What Provo offers**                                                     |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Founders & indie hackers      | Self-directed work with no external deadlines leads to chronic drift | AI as an external forcing function - treats shipped things as commitments |
| Early-career professionals    | Ambitious goals, low structure, high distraction                     | Daily cadence and escalation that mimics a demanding manager              |
| Fitness & health strivers     | Start-stop cycle with no accountability partner available 24/7       | Proof-required check-ins, voice nudges, and streak psychology             |
| Students & learners           | Study plans made and abandoned; no one holding them to it            | Deadline tracking with escalating urgency as due dates approach           |
| People in therapy or coaching | Goals set in sessions, forgotten between them                        | Bridges the gap between intention and action between appointments         |

**Excluded at launch**

- Enterprise/team accountability - B2B is a later motion; v1 is personal.
- Users seeking a gentle, supportive wellness app - Provo's tone is direct, not therapeutic.

# **4\. Product Strategy: The Hooked Model**

Provo is architected around Nir Eyal's Hooked Model. Each phase is a deliberate design decision, not a passive byproduct of functionality.

## **4.1 Trigger**

The trigger phase answers: what brings the user back? Provo flips the standard model - instead of relying on the user to remember to open the app, the AI is the trigger.

**External triggers**

- Push notifications - but not generic ones. Provo's notifications reference the exact commitment: "You said you'd finish the Provo landing page by 11 PM. 2 hours left. Check in."
- Voice notes - AI-generated audio messages sent when push notifications are ignored. Hearing a voice creates urgency text cannot.
- Phone calls - the nuclear option for repeated misses or escalated commitments. A real phone call from Provo.
- Social escalation - with user permission, contacts can be notified if a high-stakes commitment is missed.

**Internal triggers**

- Guilt and self-accountability - users who have made a commitment feel discomfort when they haven't followed through. Provo is designed to sharpen, not soften, this feeling.
- Streak identity - "I'm a 12-day clean streak" becomes part of self-image. Breaking it triggers internal urgency.
- Fear of escalation - knowing the AI will call if you don't check in creates anticipatory motivation.

## **4.2 Action**

The action is the simplest behaviour the user can perform in anticipation of reward. Provo minimises friction here to near-zero.

- One-tap check-in from the notification - no need to open the app for simple confirmations.
- Proof submission - photo, screenshot, or short voice note. Takes under 30 seconds.
- Commitment logging - a single sentence of what you'll do and when. The AI handles all the structure.

| **Design rule**                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------- |
| The action must be easier than ignoring Provo. If submitting proof takes more than 30 seconds, we've failed the action phase. |
| Every additional tap is an excuse for the user not to check in. Measure this religiously.                                     |

## **4.3 Variable Reward**

Variable rewards create habit loops through unpredictability. Provo deploys three reward types.

**Rewards of the self**

- Streak count - the number of consecutive days with zero missed commitments, displayed prominently.
- AI tone variation - the AI's response to a completed commitment varies: sometimes warm and affirming, sometimes curt and functional. This unpredictability keeps the interaction alive.
- Pattern insights - "You always miss commitments made after 9 PM. Here's what that pattern says about you." Personalised self-knowledge is deeply rewarding.

**Rewards of the tribe**

- Accountability partners - users can share a commitment with a specific person, who gets notified of outcome.
- Social proof on completion - optional share to social when a major commitment is fulfilled.

**Rewards of the hunt**

- Postpone budget - users get 3 postponements per commitment. Spending one feels like a resource. Having them remaining feels like an asset.
- Escalation avoidance - successfully checking in before Provo escalates is its own reward.

## **4.4 Investment**

Investment makes the product more valuable with use, and makes leaving costly.

- Commitment history - a full log of every promise made, completed, postponed, or broken. This becomes a personal record the user won't want to abandon.
- AI personalisation - Provo learns your patterns over time: when you're most likely to ghost, which commitment types you always reschedule, what language motivates you vs. falls flat.
- Streak stakes - a 40-day streak is not just a number. It's stored effort. Losing it feels like a real loss.
- Postpone reputation - Provo tracks your postponement history. A user with a clean record is rewarded; a serial postponer gets called out. The record itself is an investment.
- Escalation contacts - once a user has added trusted contacts to their escalation chain, removing them feels like a regression.

# **5\. Core Features - v1.0**

## **5.1 Commitment Creation**

The entry point of every Hooked loop. Users make a commitment in plain language - Provo extracts structure.

| **Field**              | **Description**                                                           |
| ---------------------- | ------------------------------------------------------------------------- |
| Commitment text        | Free text, what the user is committing to do                              |
| Deadline               | Date + time. Can be spoken naturally: "tonight by 11" or "Friday morning" |
| Proof type             | None / Photo / Screenshot / Voice note / Text description                 |
| Postpone budget        | 1, 2, or 3 max postponements allowed. User sets this at creation.         |
| Stakes level           | Low / Medium / High - determines escalation speed and intensity           |
| Accountability contact | Optional. A person who gets notified of outcome.                          |

The AI confirms the commitment in its own words - e.g., "Got it. You're committing to shipping the Provo landing page by 11 PM tonight. I'll reach out at 9 PM to check in. You have 2 postponements if you need them." This confirmation is part of the psychological contract.

## **5.2 Proactive Check-In System**

The core mechanic. Provo doesn't wait - it initiates contact based on the commitment timeline.

**Check-in schedule logic**

- For same-day commitments: check-in at 50% of remaining time and again at 85%.
- For multi-day commitments: daily morning nudge + 4-hour-before alert.
- Missed check-in triggers escalation protocol immediately (not on next scheduled interval).

**Check-in modalities**

| **Modality**              | **Trigger condition**                            |
| ------------------------- | ------------------------------------------------ |
| Push notification         | First contact for all check-ins                  |
| In-app message (AI text)  | User opens app without responding to push        |
| Voice note (AI-generated) | No response after 2nd push notification          |
| Phone call (AI voice)     | No response after voice note + 30 min elapsed    |
| Contact notification      | User-configured, triggered on High-stakes misses |

## **5.3 Escalation Protocol**

The signature feature. Each step increases social and psychological pressure. The user sees their current escalation stage in real-time.

| **Stage**            | **What happens**                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Stage 1 - Push       | Standard push notification with commitment text and check-in CTA                                                     |
| Stage 2 - Message    | In-app AI message, more direct in tone: "You haven't checked in. Are you doing this or not?"                         |
| Stage 3 - Voice note | AI-generated voice message sent via push or SMS. Harder to ignore than text.                                         |
| Stage 4 - Phone call | Actual AI phone call. User must pick up and confirm status verbally or by keypress.                                  |
| Stage 5 - Social     | Pre-configured contact receives message: "\[User\] committed to \[X\] by \[time\] and has not confirmed completion." |

Users can pause escalation mid-protocol by opening the app and responding - this is the desired response. Escalation is not punishment; it is pressure designed to motivate the action.

| **Why phone calls?**                                                                                           |
| -------------------------------------------------------------------------------------------------------------- |
| Push notification open rates have declined to under 5% in 2025. Calls have a >60% answer rate.                 |
| A phone call from an AI at 10 PM about an unmet commitment is memorable, shareable, and effective.             |
| It is also the feature users tell friends about. It is a word-of-mouth engine disguised as a product mechanic. |

## **5.4 Proof System**

Check-ins without evidence are treated as unverified. Proof is optional per commitment but recommended for high-stakes ones.

- Photo proof - user submits a photo. AI confirms it is plausibly relevant (basic vision check).
- Screenshot proof - for digital tasks (sent emails, shipped features, published posts).
- Voice note - user records a short verbal update. AI transcribes and logs it.
- Text summary - written description of what was done. Least verifiable; available for low-stakes commitments only.

Unverified check-ins are logged separately from verified ones. The Patterns dashboard distinguishes them. Over time, a user's proof rate becomes a metric they care about.

## **5.5 Patterns Dashboard**

The investment phase made visible. The dashboard shows the user a mirror of their behaviour over time.

- Streak counter - current streak, longest streak, streak history.
- Commitment completion rate - % completed on time, % postponed, % broken.
- Postpone patterns - which days/times are most likely to trigger postponement.
- Escalation history - how often the user reached Stage 3 or beyond.
- AI-generated insight - weekly text from Provo: "You've broken 3 commitments made after 10 PM. Consider not making evening commitments."

## **5.6 AI Persona**

Provo's AI has a consistent character: direct, unsentimental, focused purely on follow-through. It is not warm by default, but it is not cruel. It is honest.

- On completion: "Done. 3-day streak intact. Make your next commitment."
- On late check-in: "You're 2 hours past your deadline. Did you do this or not?"
- On postponement: "Postpone accepted. You have 1 remaining. New deadline: \[time\]. I'll be in touch."
- On second miss: "This is the second time this commitment has been missed. Do you want to cancel it or extend? Be honest."

The AI persona can be lightly personalised (less intense / more intense) in settings, but the default is the designed tone above. Softening it too much removes the product's core value proposition.

# **6\. Onboarding Flow**

Onboarding must accomplish three things in under 3 minutes: explain the concept, create the first commitment, and get the user to feel the product. Generic tutorials are skipped. Provo onboards by doing.

| **Step**                  | **What happens**                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1\. Name only             | Ask for first name. No email yet. Low friction entry.                                                            |
| 2\. One commitment        | "What's one thing you need to do in the next 24 hours?" User types freely. AI structures it.                     |
| 3\. Deadline + proof type | AI asks: "When will this be done?" and "How will you prove it?"                                                  |
| 4\. Permission request    | Notification permission + optionally phone number (for call escalation). Framed as: "So I can hold you to this." |
| 5\. Confirmation message  | AI confirms the commitment in full. The contract is made.                                                        |
| 6\. Account creation      | Email/password or social sign-in. Happens after the first commitment - user is already invested.                 |

| **Key principle**                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Account creation happens after the first commitment is logged. By the time the user hits the sign-up screen, they have already done something valuable with the product. |
| This is the Hooked Model's investment phase working before the user is even a registered user.                                                                           |

# **7\. Monetisation**

Provo operates on a free trial to monthly subscription model. There is no permanent free tier - the product's core value (escalation, phone calls, voice notes) has real per-user costs and should not be given away indefinitely.

| **Period**            | **Access**                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Days 1-7 (Free trial) | Full access to all features including phone calls and escalation. No credit card required to start.    |
| Day 7+                | Subscription required to continue. All commitments and history are preserved but frozen until payment. |

**Pricing**

To be validated through user research and willingness-to-pay testing. Hypothesis: Rs 499/month in India, \$9.99/month in international markets. Annual plan at ~40% discount.

**Paywall design principles**

- Show the paywall only after the trial is used - not on day 4 or 5.
- The paywall message is from Provo AI, not a generic subscription screen: "Your trial is up. You made 3 commitments. 2 completed. Keep going?"
- No feature-gating within trial - users experience the full product, then decide.
- Commitments in progress stay visible on the paywall screen. Unfinished business is the conversion mechanic.

# **8\. Technical Architecture (v1)**

| **Layer**          | **Technology**                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| Mobile client      | React Native (Expo) - iOS + Android from single codebase                |
| Backend API        | Node.js + Hono on Cloudflare Workers                                    |
| Database           | PostgreSQL via Neon (serverless)                                        |
| ORM                | Drizzle ORM                                                             |
| Auth               | Better Auth                                                             |
| AI / LLM           | Anthropic Claude API - commitment parsing, AI persona, pattern insights |
| Voice generation   | ElevenLabs - for voice notes and call audio                             |
| Phone calls        | Twilio - outbound AI phone calls                                        |
| Push notifications | Expo Push Notifications                                                 |
| Payments           | RevenueCat - subscription management across iOS + Android               |
| File storage       | Cloudflare R2 - proof photo/audio storage                               |

# **9\. Success Metrics**

Provo's North Star is commitment completion rate - the % of commitments users log that are marked complete with proof. Everything else is a lever on this number.

**Primary metrics**

| **Metric**                 | **Target (Month 3)**                                                |
| -------------------------- | ------------------------------------------------------------------- |
| Commitment completion rate | \>65% of commitments completed with proof                           |
| Day 7 retention            | \>40% of users still active at trial end                            |
| Trial-to-paid conversion   | \>20% of trial users convert to paid                                |
| Week 4 retention (paid)    | \>70% of paid users still active 4 weeks in                         |
| Escalation reach rate      | <15% of commitments reaching Stage 3 (voice note) - lower is better |

**Secondary metrics**

- Average commitments per active user per week - target >3.
- Proof submission rate - % of completed commitments with proof attached - target >50%.
- Streak length distribution - % of users with 7+ day streaks by month 2.
- Notification open rate on Provo-initiated messages - target >30% (3x industry avg).
- Referral rate - % of users who share Provo (organic WOM, especially phone call stories).

# **10\. Out of Scope - v1.0**

The following are explicitly excluded from v1 to maintain focus. They are logged for future consideration, not dismissed.

- Team or group accountability - social/team features require different architecture and moderation.
- Integrations (calendar, Notion, Todoist) - manual commitment entry keeps the psychological weight. Sync removes friction we want to keep.
- Gamification beyond streaks - leaderboards, badges, and levels dilute the product's seriousness.
- Therapy-adjacent features - Provo is not a mental health product. Crisis detection, mood logging, journaling are out.
- Web app - mobile-first is the right constraint for v1. Notifications and calls require mobile.
- Customisable AI persona beyond intensity setting - the persona is the product.

# **11\. Risks & Mitigations**

| **Risk**                                                   | **Likelihood** | **Mitigation**                                                                                      |
| ---------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| Users find phone calls too invasive and churn              | Medium         | Phone calls are opt-in at commitment creation. Default escalation stops at voice note.              |
| Twilio + ElevenLabs costs make unit economics unviable     | Medium         | Phone calls are a paid-tier feature only. Audit per-call costs before launch.                       |
| AI commitment parsing misinterprets user intent            | Low            | AI always confirms back in plain language before committing. User confirms before contract is set.  |
| Notification fatigue causes users to disable push entirely | Medium         | Escalation cadence is tied to user behaviour, not fixed time intervals. Smart pacing reduces noise. |
| Trial users don't experience escalation in 7 days          | Low            | Onboarding commitment is set for 24 hours. User sees the product working immediately.               |
| App Store rejection for phone call feature                 | Low            | Call is user-initiated consent at commitment creation. Privacy-first framing in app store listing.  |

# **12\. Launch Plan**

**Phase 1 - Private beta (Weeks 1-4)**

- 20-30 hand-picked users from founder/indie hacker communities.
- Manual onboarding call with each user to learn vocabulary and pain.
- Core loop: commitment → check-in → escalation. No Patterns dashboard yet.
- Success signal: >50% of beta users make a second commitment after the first.

**Phase 2 - Public launch (Weeks 5-8)**

- App Store + Play Store release.
- Launch on Product Hunt with a demo video showing the phone call mechanic.
- Twitter/X content strategy: real screenshots of Provo calling users (with consent).
- No paid ads until conversion rate from organic is understood.

**Phase 3 - Growth (Month 3+)**

- Referral mechanic: "Share the commitment with a friend" - accountability partner invite.
- Content: case studies of commitments completed through Provo's escalation.
- Evaluate annual plan pricing and international market pricing.

# **13\. Open Questions**

These need answers before or during beta. They are not blockers to starting, but they are blockers to scaling.

- What is the right default escalation intensity? Should the AI start warm and escalate to cold, or be neutral throughout?
- How does Provo handle commitments that were genuinely impossible to meet (illness, emergency)? Should the AI distinguish between excuses and real exceptions?
- What is the minimum commitment volume required to generate meaningful Patterns insights? How do we handle the first 2 weeks before there is history?
- Should Provo support recurring commitments (daily run, weekly review) or only one-off commitments in v1?
- What happens when a commitment is cancelled? Is there a cancellation penalty (postpone count hit, streak flag)?
- How do we define and measure a 'broken' commitment vs. a 'postponed' one? The distinction matters for the Patterns data.}

_End of Document - Provo PRD v1.0_