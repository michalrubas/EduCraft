# EduCraft Visual Redesign

**Date:** 2026-05-09
**Scope:** Visual-only redesign — no functional, state, or logic changes
**Source:** Claude Design handoff bundle (`/tmp/adiquest/project/screens/`)
**Approach:** Incremental by screen (shared foundation first, then each screen as a reviewable chunk)

---

## 1. Foundation: Palette, Shadows, Typography

### New palette (replaces dark neon-on-black)

| Token | Value | Usage |
|-------|-------|-------|
| `sky1` | `#7ec8f0` | Top of sky gradient |
| `sky2` | `#a8dcf2` | Mid sky |
| `grass1` | `#5fb84a` | Bottom of gradient / green accent |
| `grass2` | `#3f8e2d` | Darker green |
| `card` | `#fffaf0` | Parchment surface |
| `cardEdge` | `#3a2410` | Wood-brown border |
| `ink` | `#2b1d10` | Primary text |
| `inkSoft` | `#6b5b48` | Secondary text |
| `gold` | `#f5b90d` | Gold accent |
| `goldDeep` | `#b67806` | Gold edge/shadow |
| `diamond` | `#3ac8d1` | Diamond currency |
| `emerald` | `#30b15c` | Emerald currency |
| `star` | `#ffd84a` | Star currency |
| `red` | `#e64a3a` | Danger / "HRÁT" badge |
| `purple` | `#9b59b6` | Epic rarity |
| `shadow` | `rgba(58, 36, 16, 0.25)` | General shadow |

### Block depth shadow system

Replace flat box-shadows with chunky 3D "block depth":

```ts
const block = (depth = 4, color = theme.cardEdge) =>
  `0 ${depth}px 0 ${color}, 0 ${depth + 2}px ${depth * 2}px rgba(0,0,0,0.18)`;
```

Inset variant for block faces:
```
inset -6px -6px 0 rgba(0,0,0,0.28), inset 6px 6px 0 rgba(255,255,255,0.30)
```

### Typography

- Keep Nunito as the sole font family
- Primary weight: 900 (headings, buttons), 800 (body)
- Text colors: `ink` for primary, `inkSoft` for secondary, `#fff` for on-color surfaces

### Sky gradient backgrounds

Three variants used across screens:
- **Full sky:** `linear-gradient(180deg, sky1 0%, sky2 60%, grass1 100%)` — Home, Game, Reward
- **Short sky:** `linear-gradient(180deg, sky1 0%, sky2 100%)` — Shop, Profile
- **Decorative clouds:** SVG `Cloud` component (3 overlapping white ellipses) placed absolutely behind content

---

## 2. HUD Redesign

**File:** `src/components/hud/HUD.tsx`

### Current → New

| Element | Current | Redesign |
|---------|---------|----------|
| Container | Dark bar `#0a150a`, `height: 56`, full-width sticky | Transparent row, `padding: 10px 12px`, no background |
| Level | Green text "Lev 3" in dark pill | Avatar emoji (🧑‍🌾) in parchment pill + "LEVEL" label + number + vertical XP bar |
| Currencies | Gold text with emoji inline | 3 parchment `Coin` chips with colored circle icon backgrounds |
| XP bar | Separate 4px green bar below HUD | Folded into avatar pill as 8×24px vertical bar |
| Mute | Speaker icon at far right | Removed from HUD (moved to profile or settings) |

### ComboPips (replaces ComboBar)

**File:** `src/components/hud/ComboBar.tsx` → new `ComboPips` component

- 3 fire emoji (🔥) pips in a row, centered
- Active pips: `drop-shadow(0 0 8px rgba(255,140,0,0.7))`
- Inactive pips: `grayscale(1) opacity(0.35)`
- Parchment status label beside pips showing combo text
- Maps to existing `COMBO_THRESHOLDS`: pip 1 at 3, pip 2 at 5, pip 3 at 10

---

## 3. ScreenShell Wrapper

New shared component wrapping every screen:

```tsx
function ScreenShell({ background, children }) {
  // height: 100%, flex column, overflow: hidden
  // position: relative for floating nav
  // pulse keyframe animation for letter task
}
```

Used by: HomeScreen, GameScreen, RewardScreen, ShopScreen, ProfileScreen.

---

## 4. HomeScreen

**File:** `src/components/screens/HomeScreen.tsx`

### Layout changes

| Element | Current | Redesign |
|---------|---------|----------|
| Background | Solid dark `#0d1b0f` | Sky gradient (full) + Cloud SVGs |
| Title | "Vyber svět 🌍" in gold | "TVOJE CESTA" subtitle + "Kam dnes?" heading in `ink` |
| World picker | 2×N vertical grid of WorldCards | Horizontal scrollable carousel of WorldNodes |
| Path decoration | None | Dotted SVG path behind carousel |
| Bottom nav | 3-tab sticky bar (Světy, Obchod, Profil) | 2 floating rounded buttons (MAPA, BATOH) |
| Combo display | ComboBar in HUD | ComboPips below carousel |

### WorldNode component (replaces WorldCard)

Three states:
- **Done:** Full-color block + golden ✓ circle badge (top-right)
- **Current:** 130px (vs 100px), translateY(-8px), red "HRÁT" pill above, gold progress bar at bottom
- **Locked:** Grey/desaturated, shows 🔒, parchment cost pill below

Each node: rounded square with `blockInset` shadows, `4px solid edge` border, `borderRadius: 10`.

### Floating bottom nav

- 2 buttons: 🗺️ MAPA (home), 🎒 BATOH (shop)
- `position: absolute`, `bottom: 22px`, centered with gap 14
- Active button: gold background; inactive: parchment
- `block(4)` shadow, `borderRadius: 18`
- Content spacer `div` with `height: 90px` to prevent overlap

---

## 5. GameScreen + Task Types

**File:** `src/components/screens/GameScreen.tsx`

### GameScreen shell

- Sky gradient background + clouds
- HUD at top
- `GameHeader` chip: parchment "← Mapa" button + world/task info pill
- ComboPips below header
- Task area centered in remaining space

### MathTask (`src/components/tasks/MathTask.tsx`)

| Element | Current | Redesign |
|---------|---------|----------|
| Question | Flat text "7 + 5 = ?" | `SignBoard` — wooden sign with post, gradient `#c98e4a → #a86d2e`, `block(5)` shadow |
| Answers | 3×2 grid of 6 flat buttons | 2×2 grid of 4 `CubeButton`s, each a different color |
| Button style | Flat dark surface, thin border | Rounded (14px), colored, `blockInset` + `0 6px 0 edge` bottom shadow |

### CountingTask (`src/components/tasks/CountingTask.tsx`)

- SignBoard for question ("Kolik je tam jablek?")
- Objects displayed in a "wooden box" — parchment `#e8d6a8` background, `4px solid cardEdge`, `block(4)`
- 3×1 grid of CubeButtons for answers (fewer choices)

### CompareTask (`src/components/tasks/CompareTask.tsx`)

- SignBoard for question ("Které je větší?")
- Two large CubeButtons (size "lg", 100×100) flanking a "?" text
- Three operator CubeButtons (`<`, `=`, `>`) in a row below, each a different color (purple, brown, red)

### MissingLetterTask (`src/components/tasks/MissingLetterTask.tsx`)

- SignBoard for question ("Doplň písmenko")
- Letter tiles in a row: parchment cards with `block(4)` shadow
- Missing slot: gold background (`RD.gold`), gold edge, `pulse` animation (translateY -3px), shows `_`
- 4×1 grid of CubeButtons for letter choices

### CubeButton component (shared)

```tsx
function CubeButton({ label, color, edge, size = 'md' }) {
  // aspectRatio: 1.1, borderRadius: 14
  // background: color, border: 4px solid edge
  // boxShadow: blockInset + 0 6px 0 edge
  // fontSize: sm=28, md=36, lg=50
  // fontWeight: 900, color: #fff, textShadow
}
```

### SignBoard component (shared)

- Wooden post: 14×28px `#7a4a1a` centered below
- Sign body: gradient `#c98e4a → #a86d2e`, `4px solid cardEdge`, `borderRadius: 12`, `block(5)`
- White text, `fontWeight: 900`, `textShadow`, `letterSpacing: 1`

---

## 6. ShopScreen

**File:** `src/components/screens/ShopScreen.tsx`

### Layout changes

| Element | Current | Redesign |
|---------|---------|----------|
| Background | Dark `#0d1b0f` | Sky gradient (short) + Cloud |
| Main tabs | Gold text with underline | Two parchment card buttons, active has `block(4)` shadow |
| Category tabs | Dark flat buttons, tab-shaped | Rounded pill buttons, active gets gold background |
| Item cards | Dark surface, thin border | Parchment cards, `borderRadius: 12`, `block(3)` shadow |
| Owned badge | "✓ mám" text | Green circle with ✓ positioned at top-right corner |
| Price tag | Teal text | Gold pill with icon + cost |
| Rarity | No visual distinction | Epic: purple border + purple gradient bg. Legendary: orange border + gold gradient bg |

### Showcase tab

- 4×2 slot grid: filled slots have parchment + gold border + `block(3)`, empty slots dashed border + "?"
- Owned items list below: 3-column grid, items in showcase get gold border + "⭐ ve vitríně" label

---

## 7. ProfileScreen

**File:** `src/components/screens/ProfileScreen.tsx`

### Layout changes

- Sky gradient (short) + Cloud
- **Hero card:** Large parchment card with avatar (64px), name "Adínek", XP bar, level info
- **Stats:** `SectionTitle` ("📊 Statistiky") + 2×2 grid of parchment stat cards with icon, label, and large value
- **Badges:** `SectionTitle` ("🏅 Odznaky") + 3-column grid
  - Earned: parchment + gold border + `block(3, goldDeep)`
  - Unearned: translucent white, `opacity: 0.55`, `grayscale(1)` on icon

---

## 8. RewardScreen

**File:** `src/components/screens/RewardScreen.tsx`

### Layout changes

| Element | Current | Redesign |
|---------|---------|----------|
| Background | Dark | Sky gradient (full) + clouds |
| Check icon | Green circle with ✓ | Green circle with ✓ + golden ray burst SVG (12 lines radiating outward) |
| Text | "SPRÁVNĚ!" in green | "SUPER!" in `ink` brown with white text-shadow |
| Rewards | Simple text | `RewardChip` parchment pills with colored circle icon |
| Combo | Text label | Parchment card with 🔥 icon + "SÉRIE" label + "4× v řadě" |

### RewardChip component

- Parchment pill, `3px solid cardEdge`, `borderRadius: 999`, `block(4)`
- Colored circle icon (32px) with blockInset shadow + value text

---

## 9. Overlays

### LevelUpOverlay (`src/components/ui/LevelUpOverlay.tsx`)

- `OverlayBackdrop`: `rgba(43, 29, 16, 0.78)` (warm brown, not pure black)
- Parchment card, `borderRadius: 22`, `block(6)`
- "★ NOVÝ LEVEL ★" header in `goldDeep`
- Golden gradient circle (110px, `radial-gradient`) with level number
- "Level N!" text + encouragement + `ButtonPrimary`

### LuckyWheel (`src/components/ui/LuckyWheel.tsx`)

- Same `OverlayBackdrop`
- Parchment card container
- SVG wheel with 6 colored slices (diamond, gold, emerald, star, purple), `3px stroke cardEdge`
- Gold center circle, red triangle pointer at top
- `ButtonPrimary` "ROZTOČIT"

### MysteryChest (`src/components/ui/MysteryChest.tsx`)

- Same `OverlayBackdrop`
- Parchment card with "TAJEMNÁ TRUHLA" header
- Wooden chest built from two divs (lid + body) with brown gradients, `blockInset` shadows
- Gold latch in center
- Sparkle emojis (✨) positioned around chest
- `ButtonPrimary` "OTEVŘÍT"

### SeriesComplete (in `GameScreen.tsx`)

- `OverlayBackdrop`
- Trophy emoji (80px) with gold glow `drop-shadow`
- "SÉRIE!" in gold with text-shadow
- "10 správných v řadě 🔥🔥🔥" in white
- Two `RewardChip`s below

### Shared overlay components

- `OverlayBackdrop`: warm brown overlay `rgba(43, 29, 16, 0.78)`, centered flex
- `ButtonPrimary`: gold background, `3px solid cardEdge`, `borderRadius: 14`, `block(4, goldDeep)`, `fontWeight: 900`

---

## 10. Implementation approach

**Incremental by screen** — build shared foundation first, then each screen as a separately reviewable chunk:

1. **Foundation** — CSS variables, `block()` helper, `ScreenShell`, `Cloud`, theme tokens in `styles.css`
2. **HUD + ComboPips** — new `HUD.tsx` layout, new `ComboPips` component
3. **HomeScreen** — journey carousel, `WorldNode`, floating nav
4. **GameScreen + tasks** — `SignBoard`, `CubeButton`, restyle each task component
5. **ShopScreen** — tabs, category pills, item cards, showcase
6. **ProfileScreen** — hero card, stat grid, badge grid
7. **RewardScreen** — ray burst, reward chips, combo card
8. **Overlays** — `OverlayBackdrop`, `ButtonPrimary`, LevelUp, Wheel, Chest, Series

Each step is a standalone commit that can be reviewed and tested in isolation.

---

## 11. What does NOT change

- No state/logic changes — Zustand store, game logic, task generators untouched
- `persist` key `adicraft-game-v1` stays the same
- `vercel.json` rewrite rule stays the same
- Supabase sync hook stays the same
- Screen routing via `currentScreen` stays the same
- Framer Motion `AnimatePresence` transitions stay the same
- Task rendering logic in `TaskRenderer.tsx` stays the same
- All world definitions in `worlds.ts` stay the same (only `bgColor` values may update)
