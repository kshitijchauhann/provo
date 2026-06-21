# Provo — Design System

## Philosophy

Provo is not a wellness app. It does not comfort. It does not celebrate mediocrity.  
The visual language reflects that — dark, serious, precise. Every design decision should make the user feel like they are being watched by something that means business.

The closest reference is Spotify — same dark-first thinking, same bold type hierarchy, same use of a single accent color to create moments of energy inside an otherwise restrained palette. Spotify uses green. Provo uses amber.

---

## Typography

**Font family: Arvo (Google Fonts)**

Arvo is a geometric slab serif. It reads as serious and structured — not clinical, not friendly. It carries weight without shouting.

| Role | Weight | Usage |
|---|---|---|
| Headings | Arvo Bold (700) | Screen titles, section headers, commitment titles, AI persona name |
| Body | Arvo Regular (400) | Paragraphs, descriptions, meta text, labels |

**No other typefaces.** Arvo Bold and Arvo Regular only. Hierarchy is created through size and color, not by mixing fonts.

### Type Scale

| Level | Size | Weight | Color | Usage |
|---|---|---|---|---|
| Display | 32px | Bold | Warm White | Screen title (e.g. "You said you would.") |
| H1 | 24px | Bold | Warm White | Section headings |
| H2 | 18px | Bold | Warm White | Card titles, commitment names |
| Body | 14px | Regular | Warm White / 70% | Descriptions, AI messages, meta |
| Caption | 11px | Regular | Warm White / 40% | Timestamps, labels, status text |
| Mono label | 11px | Regular | Amber | Status chips, escalation stages, badges |

> Mono label uses Arvo Regular with letter-spacing: 0.15em and text-transform: uppercase. This creates the "data terminal" feel for status indicators without switching to a monospace font.

---

## Color

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0A0A08` | App background — near black with a faint warm undertone |
| `--color-surface-1` | `#111110` | Primary card background |
| `--color-surface-2` | `#1A1A18` | Elevated card, modal background |
| `--color-surface-3` | `#242422` | Hover states, selected rows |
| `--color-border` | `rgba(232, 228, 217, 0.08)` | Subtle card borders |
| `--color-border-strong` | `rgba(232, 228, 217, 0.18)` | Dividers, focused inputs |

### Text

| Token | Hex / Opacity | Usage |
|---|---|---|
| `--color-text-primary` | `#E8E4D9` | Warm white — all primary text |
| `--color-text-secondary` | `rgba(232, 228, 217, 0.60)` | Secondary body, descriptions |
| `--color-text-muted` | `rgba(232, 228, 217, 0.35)` | Captions, timestamps, placeholders |
| `--color-text-disabled` | `rgba(232, 228, 217, 0.18)` | Disabled states |

> Warm white `#E8E4D9` is not pure white. It has a slight cream tone that keeps it from feeling clinical against the near-black background. Never use `#FFFFFF` for text.

### Accent — Amber

Amber is used sparingly. It should feel like a signal, not decoration. When the user sees amber, something important is happening.

| Token | Hex | Usage |
|---|---|---|
| `--color-amber` | `#DCA03C` | Streak counter, active nav item, primary CTA, badges |
| `--color-amber-dim` | `rgba(220, 160, 60, 0.15)` | Amber card tint, chip background |
| `--color-amber-border` | `rgba(220, 160, 60, 0.30)` | Amber card border, input focus ring |

### Status Colors

Used only for commitment state. Not decorative.

| Token | Hex | Usage |
|---|---|---|
| `--color-red` | `#E8523A` | Overdue, escalation active, broken commitment |
| `--color-red-dim` | `rgba(232, 82, 58, 0.10)` | Overdue card tint |
| `--color-green` | `#7AB648` | On track, completed, verified proof |
| `--color-green-dim` | `rgba(122, 182, 72, 0.10)` | On-track card tint |

---

## Surfaces & Cards

Cards are the primary container. All content lives in cards. Cards sit on the `--color-bg` background.

### Base Card

```
background: var(--color-surface-1)       // #111110
border: 0.5px solid var(--color-border)  // rgba(232,228,217,0.08)
border-radius: 8px
padding: 14px
```

### Elevated Card (modal, bottom sheet)

```
background: var(--color-surface-2)       // #1A1A18
border: 0.5px solid var(--color-border-strong)
border-radius: 12px
padding: 20px
```

### Status Cards

Cards with commitment state use a **left border accent** (2px) plus a faint tinted background. The rest of the card stays dark.

| State | Left border | Background tint |
|---|---|---|
| Overdue | `#E8523A` | `rgba(232,82,58,0.06)` |
| On track | `#7AB648` | `rgba(122,182,72,0.06)` |
| At risk | `#DCA03C` | `rgba(220,160,60,0.06)` |
| Neutral | none | `var(--color-surface-1)` |

The tint should be barely visible — the left border does the work, the tint just reinforces it.

---

## Spacing

Base unit: **8px**

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon gap, tight inline spacing |
| `--space-2` | 8px | Gap between elements in a card |
| `--space-3` | 12px | Card internal padding (compact) |
| `--space-4` | 16px | Standard card padding |
| `--space-5` | 20px | Screen horizontal margin |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large section gap |

Horizontal screen margin is always **20px**. Nothing bleeds to the edge.

---

## Iconography

Use **Tabler Icons** (tabler.io). Stroke weight: 1.5px. Size: 20px in nav, 16px inline, 24px in empty states.

Never filled icons. Outline only. Filled icons feel too friendly for Provo's tone.

---

## Components

### Status Chip / Badge

Small uppercase label. Used for commitment state, escalation stage, proof status.

```
font: Arvo Regular, 9–11px
letter-spacing: 0.12em
text-transform: uppercase
padding: 3px 8px
border-radius: 3px
border: 0.5px solid [status-border]
background: [status-dim]
color: [status-color]
```

### Postpone Dots

Visual budget tracker for postponements. Row of 3 dots — filled = used, empty = remaining.

```
dot size: 6px × 6px
border-radius: 50%
gap: 3px
used: background #E8523A
empty: background rgba(232,228,217,0.10), border 0.5px rgba(232,228,217,0.15)
```

### AI Message Block

The primary voice of Provo. Used on home screen, check-in prompts, paywall.

```
background: rgba(232,82,58,0.07)
border: 0.5px solid rgba(232,82,58,0.25)
border-left: 2px solid #E8523A
border-radius: 4px
padding: 12px 14px
```

Avatar: 28×28px, border-radius 4px, background `#E8523A`, letter "P" in Arvo Bold, color `#0A0A08`.

### Escalation Progress

Horizontal step indicator showing which escalation stage is active.

- Steps: Push → Message → Voice Note → Call
- Done steps: amber icon + amber label
- Active step: red icon + red label + pulse animation
- Future steps: dim icon + muted label
- Connector lines between steps change from muted to amber as steps complete

### Bottom Navigation

4 items: Command, History, Patterns, Settings.

```
background: rgba(10,10,8,0.97)
border-top: 0.5px solid rgba(232,228,217,0.08)
active item color: var(--color-amber)
inactive item color: rgba(232,228,217,0.25)
label: Arvo Regular, 9px, letter-spacing 0.10em, uppercase
```

### Primary Button

Used sparingly. Main CTAs only.

```
background: var(--color-amber)
color: #0A0A08
font: Arvo Bold, 13px, letter-spacing 0.08em, uppercase
border-radius: 6px
padding: 13px 20px
border: none
```

### Ghost Button

Secondary actions, "make a new commitment."

```
background: transparent
border: 0.5px solid var(--color-amber-border)
color: rgba(220,160,60,0.70)
font: Arvo Regular, 12px, letter-spacing 0.15em, uppercase
border-radius: 8px
padding: 13px
hover: background var(--color-amber-dim), border-color var(--color-amber)
```

---

## Motion

Minimal. Motion is used to signal state change, not to delight.

| Interaction | Animation |
|---|---|
| Status dot (active) | opacity pulse, 1.8s, ease-in-out, infinite |
| Escalation active step | same pulse, 1.5s |
| Card hover | border-color transition, 150ms |
| Button hover | background/color transition, 150ms |
| Screen transition | fade, 200ms — no slides or bounces |

No spring physics. No playful easing. Transitions are fast and functional.

---

## Texture

A subtle scanline overlay sits above the background on all screens.

```css
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(255, 255, 255, 0.012) 2px,
  rgba(255, 255, 255, 0.012) 4px
);
pointer-events: none;
z-index: 1;
```

Opacity is intentionally very low (`0.012`). It should not be visible at a glance — only noticeable when looking for it. Its purpose is to add depth to the background without making the app feel retro.

---

## Tone Reference — Spotify Parallel

| Element | Spotify | Provo |
|---|---|---|
| Background | `#121212` | `#0A0A08` |
| Surface card | `#181818` | `#111110` |
| Accent | `#1DB954` (green) | `#DCA03C` (amber) |
| Text primary | `#FFFFFF` | `#E8E4D9` (warm white) |
| Font | Circular | Arvo |
| Accent usage | Album art, play button, active state | Streak, active nav, primary CTA, status chips |

The core principle is the same: a near-black foundation with one accent color that earns attention. The difference is the mood — Spotify is energetic, Provo is serious.

---

## What Provo Is Not

- Not rounded and friendly — border radii stay at 4–8px, never 16px+
- Not colorful — two accent colors max on any screen (amber + one status color)
- Not illustrative — no illustrations, no characters, no playful iconography
- Not gradient-heavy — flat surfaces only; gradients only on overlays (bottom fade on lists)
- Not white — light mode does not exist