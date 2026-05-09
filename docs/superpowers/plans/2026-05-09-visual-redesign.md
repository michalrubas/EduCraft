# EduCraft Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark neon-on-black UI with a light sky-over-grass Minecraft aesthetic — visual only, no state/logic changes.

**Architecture:** CSS variables swap, new shared components (`ScreenShell`, `Cloud`, `SignBoard`, `CubeButton`, `ComboPips`, `OverlayBackdrop`, `ButtonPrimary`, `RewardChip`), then restyle each screen/task component one by one. All changes are inline styles + CSS variable updates — no new packages.

**Tech Stack:** React, Framer Motion (already installed), CSS custom properties, TypeScript.

---

## File Structure

### New files to create
| File | Responsibility |
|------|---------------|
| `src/components/ui/ScreenShell.tsx` | Shared screen wrapper (sky gradient, overflow, clouds, pulse keyframe) |
| `src/components/ui/Cloud.tsx` | Decorative SVG cloud component |
| `src/components/ui/SignBoard.tsx` | Wooden sign with post for task questions |
| `src/components/ui/CubeButton.tsx` | Chunky 3D answer button with inset shadows |
| `src/components/ui/OverlayBackdrop.tsx` | Warm brown overlay backdrop for modals |
| `src/components/ui/ButtonPrimary.tsx` | Gold primary action button for overlays |
| `src/components/ui/RewardChip.tsx` | Parchment pill showing earned currency |
| `src/theme.ts` | Theme tokens + `block()` shadow helper |

### Files to modify
| File | What changes |
|------|-------------|
| `src/styles.css` | CSS variables, `.screen`, `.bottom-nav`, `.hud`, remove old dark classes |
| `src/components/hud/HUD.tsx` | Avatar pill + currency chips + vertical XP bar |
| `src/components/hud/ComboBar.tsx` | Replace with ComboPips (3 fire emoji pips) |
| `src/components/screens/HomeScreen.tsx` | Journey carousel, WorldNode, floating nav |
| `src/components/screens/GameScreen.tsx` | Sky background, GameHeader chip, ComboPips, series overlay |
| `src/components/screens/RewardScreen.tsx` | Ray burst, RewardChip pills, combo card |
| `src/components/screens/ShopScreen.tsx` | Parchment cards, pill tabs, rarity borders, floating nav |
| `src/components/screens/ProfileScreen.tsx` | Hero card, stat grid, badge grid, floating nav |
| `src/components/ui/WorldCard.tsx` | Becomes WorldNode with done/current/locked states |
| `src/components/tasks/MathTask.tsx` | SignBoard + 2×2 CubeButtons |
| `src/components/tasks/CountingTask.tsx` | SignBoard + wooden box + 3×1 CubeButtons |
| `src/components/tasks/CompareTask.tsx` | SignBoard + two lg CubeButtons + 3 operator CubeButtons |
| `src/components/tasks/MissingLetterTask.tsx` | SignBoard + letter tiles + 4×1 CubeButtons |
| `src/components/tasks/MultiChoiceTask.tsx` | SignBoard + 2×2 CubeButtons |
| `src/components/tasks/FindTask.tsx` | SignBoard + 2×2 CubeButtons |
| `src/components/tasks/EngPictureTask.tsx` | SignBoard + 2×2 CubeButtons |
| `src/components/ui/LevelUpOverlay.tsx` | OverlayBackdrop + parchment card + golden circle |
| `src/components/ui/LuckyWheel.tsx` | OverlayBackdrop + parchment card + restyled wheel |
| `src/components/ui/MysteryChest.tsx` | OverlayBackdrop + parchment card + wooden chest |
| `src/components/ui/PixelButton.tsx` | Restyle to parchment/wood aesthetic |

---

### Task 1: Theme tokens and shadow helpers

**Files:**
- Create: `src/theme.ts`

- [ ] **Step 1: Create theme file**

```ts
// src/theme.ts

export const theme = {
  // Sky/grass palette
  sky1: '#7ec8f0',
  sky2: '#a8dcf2',
  grass1: '#5fb84a',
  grass2: '#3f8e2d',
  // Surfaces
  card: '#fffaf0',
  cardEdge: '#3a2410',
  ink: '#2b1d10',
  inkSoft: '#6b5b48',
  // Accents
  gold: '#f5b90d',
  goldDeep: '#b67806',
  diamond: '#3ac8d1',
  emerald: '#30b15c',
  star: '#ffd84a',
  red: '#e64a3a',
  purple: '#9b59b6',
  shadow: 'rgba(58, 36, 16, 0.25)',
  // Layout
  navH: 90,
} as const

/** Chunky 3D block-depth shadow */
export function block(depth = 4, color = theme.cardEdge) {
  return `0 ${depth}px 0 ${color}, 0 ${depth + 2}px ${depth * 2}px rgba(0,0,0,0.18)`
}

/** Inset shadow for block faces */
export const blockInset = 'inset -6px -6px 0 rgba(0,0,0,0.28), inset 6px 6px 0 rgba(255,255,255,0.30)'

/** Sky gradient variants */
export const skyFull = `linear-gradient(180deg, ${theme.sky1} 0%, ${theme.sky2} 60%, ${theme.grass1} 100%)`
export const skyShort = `linear-gradient(180deg, ${theme.sky1} 0%, ${theme.sky2} 100%)`
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npx tsc --noEmit src/theme.ts`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/theme.ts
git commit -m "feat: add theme tokens and block shadow helpers for redesign"
```

---

### Task 2: Update CSS variables and global styles

**Files:**
- Modify: `src/styles.css:1-31`

- [ ] **Step 1: Replace CSS variables and body styles**

In `src/styles.css`, replace the `:root` block and body styles:

```css
/* ── CSS Variables ── */
:root {
  --sky1:       #7ec8f0;
  --sky2:       #a8dcf2;
  --grass1:     #5fb84a;
  --grass2:     #3f8e2d;
  --card:       #fffaf0;
  --card-edge:  #3a2410;
  --ink:        #2b1d10;
  --ink-soft:   #6b5b48;
  --gold:       #f5b90d;
  --gold-deep:  #b67806;
  --diamond:    #3ac8d1;
  --emerald:    #30b15c;
  --star:       #ffd84a;
  --red:        #e64a3a;
  --purple:     #9b59b6;
  --radius:     12px;
  --hud-height: auto;
}
```

Change `body` background from `#0d1b0f` to `var(--sky1)` and `color` from `#ffffff` to `var(--ink)`.

- [ ] **Step 2: Add pulse keyframe animation**

Add at the end of `src/styles.css`:

```css
/* ── Pulse animation for letter tiles ── */
@keyframes pulse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "feat: swap CSS variables to sky-over-grass palette"
```

---

### Task 3: Create shared UI components (ScreenShell, Cloud)

**Files:**
- Create: `src/components/ui/ScreenShell.tsx`
- Create: `src/components/ui/Cloud.tsx`

- [ ] **Step 1: Create Cloud component**

```tsx
// src/components/ui/Cloud.tsx
import { CSSProperties } from 'react'

interface Props {
  style?: CSSProperties
}

export function Cloud({ style }: Props) {
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <svg width="80" height="34" viewBox="0 0 80 34">
        <ellipse cx="20" cy="22" rx="18" ry="11" fill="#fff" />
        <ellipse cx="40" cy="16" rx="22" ry="14" fill="#fff" />
        <ellipse cx="60" cy="22" rx="18" ry="11" fill="#fff" />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Create ScreenShell component**

```tsx
// src/components/ui/ScreenShell.tsx
import { ReactNode } from 'react'

interface Props {
  background: string
  children: ReactNode
}

export function ScreenShell({ background, children }: Props) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background,
      fontFamily: 'Nunito, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Cloud.tsx src/components/ui/ScreenShell.tsx
git commit -m "feat: add ScreenShell and Cloud shared components"
```

---

### Task 4: Create SignBoard, CubeButton, overlay shared components

**Files:**
- Create: `src/components/ui/SignBoard.tsx`
- Create: `src/components/ui/CubeButton.tsx`
- Create: `src/components/ui/OverlayBackdrop.tsx`
- Create: `src/components/ui/ButtonPrimary.tsx`
- Create: `src/components/ui/RewardChip.tsx`

- [ ] **Step 1: Create SignBoard**

```tsx
// src/components/ui/SignBoard.tsx
import { ReactNode } from 'react'
import { theme, block } from '../../theme'

interface Props {
  children: ReactNode
  fontSize?: number
}

export function SignBoard({ children, fontSize = 36 }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '50%', bottom: -18, transform: 'translateX(-50%)',
        width: 14, height: 28, background: '#7a4a1a',
        border: `2px solid ${theme.cardEdge}`, borderRadius: 2,
      }} />
      <div style={{
        background: 'linear-gradient(180deg, #c98e4a 0%, #a86d2e 100%)',
        border: `4px solid ${theme.cardEdge}`, borderRadius: 12,
        padding: '14px 24px', boxShadow: block(5),
        fontSize, fontWeight: 900, color: '#fff',
        textShadow: '0 2px 0 rgba(0,0,0,0.4)', letterSpacing: 1,
        textAlign: 'center', maxWidth: 320,
      }}>{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create CubeButton**

```tsx
// src/components/ui/CubeButton.tsx
import { motion } from 'framer-motion'
import { blockInset } from '../../theme'

interface Props {
  label: string | number
  color: string
  edge: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

const DIMS = {
  sm: { fontSize: 28 },
  md: { fontSize: 36 },
  lg: { fontSize: 50, width: 100 },
} as const

export function CubeButton({ label, color, edge, size = 'md', onClick, className }: Props) {
  const d = DIMS[size]
  return (
    <motion.button
      className={className}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        aspectRatio: '1.1',
        width: 'width' in d ? d.width : undefined,
        borderRadius: 14,
        background: color,
        border: `4px solid ${edge}`,
        boxShadow: `${blockInset}, 0 6px 0 ${edge}`,
        fontSize: d.fontSize,
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 2px 0 rgba(0,0,0,0.35)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </motion.button>
  )
}
```

- [ ] **Step 3: Create OverlayBackdrop**

```tsx
// src/components/ui/OverlayBackdrop.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
}

export function OverlayBackdrop({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(43, 29, 16, 0.78)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Create ButtonPrimary**

```tsx
// src/components/ui/ButtonPrimary.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { theme, block } from '../../theme'

interface Props {
  children: ReactNode
  onClick?: () => void
}

export function ButtonPrimary({ children, onClick }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      style={{
        background: theme.gold,
        border: `3px solid ${theme.cardEdge}`,
        borderRadius: 14,
        padding: '10px 22px',
        fontFamily: 'Nunito, sans-serif',
        fontSize: 16,
        fontWeight: 900,
        color: theme.ink,
        cursor: 'pointer',
        boxShadow: block(4, theme.goldDeep),
        letterSpacing: 0.5,
      }}
    >
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 5: Create RewardChip**

```tsx
// src/components/ui/RewardChip.tsx
import { theme, block } from '../../theme'

interface Props {
  icon: string
  value: string
  tint: string
}

export function RewardChip({ icon, value, tint }: Props) {
  return (
    <div style={{
      background: theme.card,
      border: `3px solid ${theme.cardEdge}`,
      borderRadius: 999,
      padding: '6px 14px 6px 6px',
      boxShadow: block(4),
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: '50%', background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.4)',
      }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 900, color: theme.ink }}>{value}</span>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SignBoard.tsx src/components/ui/CubeButton.tsx src/components/ui/OverlayBackdrop.tsx src/components/ui/ButtonPrimary.tsx src/components/ui/RewardChip.tsx
git commit -m "feat: add SignBoard, CubeButton, OverlayBackdrop, ButtonPrimary, RewardChip"
```

---

### Task 5: Redesign HUD and ComboPips

**Files:**
- Modify: `src/components/hud/HUD.tsx`
- Modify: `src/components/hud/ComboBar.tsx`

- [ ] **Step 1: Rewrite HUD.tsx**

Replace the entire content of `src/components/hud/HUD.tsx`:

```tsx
// src/components/hud/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import { getLevelData } from '../../data/levels'
import { theme, block } from '../../theme'

function Coin({ icon, value, tint }: { icon: string; value: number; tint: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: theme.card, border: `3px solid ${theme.cardEdge}`,
      borderRadius: 999, padding: '3px 10px 3px 4px',
      boxShadow: block(3),
    }}>
      <span style={{
        fontSize: 18, width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tint, borderRadius: '50%',
        boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.4)',
      }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 900, color: theme.ink }}>{value}</span>
    </div>
  )
}

export function HUD() {
  const { diamonds, emeralds, stars, level, xp } = useGameStore()
  const { progressPercent } = getLevelData(xp)

  return (
    <div style={{
      padding: '10px 12px 8px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'Nunito, sans-serif', fontWeight: 800,
      flexShrink: 0,
    }}>
      {/* Avatar + level */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: theme.card, border: `3px solid ${theme.cardEdge}`,
        borderRadius: 999, padding: '4px 12px 4px 4px',
        boxShadow: block(3),
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#ffd9a6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, border: `2px solid ${theme.cardEdge}`,
        }}>🧑‍🌾</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: 9, color: theme.inkSoft, letterSpacing: 0.5 }}>LEVEL</span>
          <span style={{ fontSize: 16, color: theme.ink, fontWeight: 900 }}>{level}</span>
        </div>
        {/* XP ring */}
        <div style={{
          width: 8, height: 24, background: '#eadfcc', borderRadius: 4, marginLeft: 4,
          overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{ width: '100%', height: `${progressPercent}%`, background: theme.grass1, transition: 'height 0.4s ease-out' }} />
        </div>
      </div>

      {/* Currencies */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
        <Coin icon="💎" value={diamonds} tint={theme.diamond} />
        <Coin icon="🟢" value={emeralds} tint={theme.emerald} />
        <Coin icon="⭐" value={stars} tint={theme.star} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite ComboBar.tsx as ComboPips**

Replace the entire content of `src/components/hud/ComboBar.tsx`:

```tsx
// src/components/hud/ComboBar.tsx
import { COMBO_THRESHOLDS } from '../../data/config'
import { theme } from '../../theme'
import { block } from '../../theme'

interface Props {
  combo: number
}

export function ComboBar({ combo }: Props) {
  // How many pips are filled: pip 1 at fire(3), pip 2 at doubleFire(5), pip 3 at mania(10)
  const filled = combo >= COMBO_THRESHOLDS.mania ? 3
    : combo >= COMBO_THRESHOLDS.doubleFire ? 2
    : combo >= COMBO_THRESHOLDS.fire ? 1
    : 0

  const statusText = combo === 0
    ? 'Začni sérii!'
    : filled === 0
    ? `${combo}× v řadě`
    : filled === 1
    ? `${combo}× v řadě`
    : filled === 2
    ? `${combo}× v řadě`
    : `${combo}× MÁNIE!`

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '2px 0 8px', flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 28, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, lineHeight: 1,
          filter: i < filled ? 'drop-shadow(0 0 8px rgba(255,140,0,0.7))' : 'grayscale(1) opacity(0.35)',
          transition: 'all 0.2s',
        }}>🔥</div>
      ))}
      {combo > 0 && (
        <div style={{
          marginLeft: 6, alignSelf: 'center',
          background: theme.card, border: `2px solid ${theme.cardEdge}`,
          borderRadius: 999, padding: '2px 10px',
          fontSize: 13, fontWeight: 900, color: theme.ink, fontFamily: 'Nunito, sans-serif',
          boxShadow: block(2),
        }}>{statusText}</div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/hud/HUD.tsx src/components/hud/ComboBar.tsx
git commit -m "feat: redesign HUD with avatar pill + currency chips + ComboPips"
```

---

### Task 6: Redesign HomeScreen with journey carousel

**Files:**
- Modify: `src/components/screens/HomeScreen.tsx`
- Modify: `src/components/ui/WorldCard.tsx`

- [ ] **Step 1: Rewrite WorldCard.tsx as WorldNode**

Replace the entire content of `src/components/ui/WorldCard.tsx`:

```tsx
// src/components/ui/WorldCard.tsx
import { motion } from 'framer-motion'
import { World } from '../../data/types'
import { theme, block, blockInset } from '../../theme'
import { CURRENCY_ICONS } from '../../data/config'

interface Props {
  world: World
  unlocked: boolean
  isCurrent: boolean
  progress?: number
  onPress: () => void
}

export function WorldCard({ world, unlocked, isCurrent, progress, onPress }: Props) {
  const size = isCurrent ? 130 : 100
  const locked = !unlocked

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onPress}
      style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transform: isCurrent ? 'translateY(-8px)' : 'none',
        paddingTop: isCurrent ? 14 : 0,
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Done badge */}
        {unlocked && !isCurrent && (
          <div style={{
            position: 'absolute', top: -8, right: -8, zIndex: 2,
            width: 28, height: 28, borderRadius: '50%',
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, boxShadow: block(2),
          }}>✓</div>
        )}
        {/* Current HRÁT badge */}
        {isCurrent && (
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
            background: theme.red, color: '#fff', fontSize: 10, fontWeight: 900,
            padding: '3px 8px', borderRadius: 999, letterSpacing: 1,
            border: `2px solid ${theme.cardEdge}`, boxShadow: block(2),
            whiteSpace: 'nowrap',
          }}>HRÁT</div>
        )}

        {/* Block face */}
        <div style={{
          width: size, height: size,
          background: locked ? '#9a9a9a' : world.blockColor,
          border: `4px solid ${locked ? '#5a5a5a' : (world.accentColor || theme.cardEdge)}`,
          borderRadius: 10,
          boxShadow: blockInset,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isCurrent ? 64 : 50, position: 'relative',
          filter: locked ? 'saturate(0.2)' : 'none',
        }}>
          {locked ? '🔒' : world.icon}
          {/* Progress bar on current world */}
          {isCurrent && progress != null && (
            <div style={{
              position: 'absolute', left: 8, right: 8, bottom: 8,
              height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.4)',
            }}>
              <div style={{ height: '100%', width: `${progress * 100}%`, background: theme.gold }} />
            </div>
          )}
        </div>
      </div>

      <div style={{
        fontSize: isCurrent ? 16 : 13, fontWeight: 900, color: theme.ink,
        textShadow: '0 1px 0 rgba(255,255,255,0.5)',
      }}>{world.name}</div>

      {locked && (
        <div style={{
          background: theme.card, border: `2px solid ${theme.cardEdge}`,
          borderRadius: 999, padding: '2px 8px',
          fontSize: 12, fontWeight: 900, color: theme.ink, display: 'flex', alignItems: 'center', gap: 3,
          boxShadow: block(2),
        }}>
          {world.unlockCurrency === 'emeralds' ? '🟢' : world.unlockCurrency === 'stars' ? '⭐' : '💎'} {world.unlockCost}
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 2: Rewrite HomeScreen.tsx**

Replace the entire content of `src/components/screens/HomeScreen.tsx`:

```tsx
// src/components/screens/HomeScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORLDS } from '../../data/worlds'
import { useGameStore } from '../../store/gameStore'
import { WorldCard } from '../ui/WorldCard'
import { HUD } from '../hud/HUD'
import { ComboBar } from '../hud/ComboBar'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { theme, block, skyFull } from '../../theme'

export function HomeScreen() {
  const { unlockedWorlds, currentWorldId, diamonds, emeralds, stars, combo, enterWorld, unlockWorld, navigateTo } = useGameStore()
  const wallet = { diamonds, emeralds, stars }
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [unlockedId, setUnlockedId] = useState<string | null>(null)

  function handleWorldPress(worldId: string, cost: number, currency: 'diamonds' | 'emeralds' | 'stars') {
    const isUnlocked = unlockedWorlds.includes(worldId)
    if (isUnlocked) {
      enterWorld(worldId)
    } else if (wallet[currency] >= cost) {
      unlockWorld(worldId, cost, currency)
      setUnlockedId(worldId)
      setTimeout(() => setUnlockedId(null), 2200)
    } else {
      setShakeId(worldId)
      setTimeout(() => setShakeId(null), 500)
    }
  }

  const unlockedWorld = unlockedId ? WORLDS.find(w => w.id === unlockedId) : null

  return (
    <ScreenShell background={skyFull}>
      <Cloud style={{ top: 90, left: 30, opacity: 0.85 }} />
      <Cloud style={{ top: 130, right: 20, opacity: 0.6, transform: 'scale(0.7)' }} />

      <HUD />

      <div style={{ padding: '4px 16px 8px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: theme.inkSoft, letterSpacing: 1.5 }}>TVOJE CESTA</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: theme.ink, lineHeight: 1.1 }}>Kam dnes?</div>
      </div>

      {/* Horizontal journey carousel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        position: 'relative', minHeight: 0,
      }}>
        {/* Dotted path */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M 20 50% Q 100 30%, 200 50% T 380 50%" fill="none"
            stroke={theme.cardEdge} strokeWidth="3" strokeDasharray="4 8" opacity="0.35" />
        </svg>
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto',
          padding: '24px 16px 28px', scrollbarWidth: 'none',
          width: '100%',
        }}>
          {WORLDS.map((world, i) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 30 }}
              animate={shakeId === world.id
                ? { x: [0, -10, 10, -10, 10, -5, 5, 0] }
                : { opacity: 1, y: 0, x: 0 }
              }
              transition={shakeId === world.id
                ? { duration: 0.4 }
                : { delay: i * 0.08 }
              }
            >
              <WorldCard
                world={world}
                unlocked={unlockedWorlds.includes(world.id)}
                isCurrent={currentWorldId === world.id || (i === 0 && !currentWorldId)}
                onPress={() => handleWorldPress(world.id, world.unlockCost, world.unlockCurrency ?? 'diamonds')}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ComboBar combo={combo} />

      {/* Unlock overlay */}
      <AnimatePresence>
        {unlockedWorld && (
          <motion.div
            key="unlock-overlay"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(43, 29, 16, 0.78)',
              zIndex: 50, pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: [0.5, 1.3, 1], rotate: [-15, 10, 0] }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 72, marginBottom: 16 }}
            >
              🔓
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 28, fontWeight: 900, letterSpacing: 1,
                color: theme.gold,
                textShadow: `0 0 20px ${theme.gold}`,
                marginBottom: 8,
              }}
            >
              {unlockedWorld.icon} {unlockedWorld.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 14, color: '#fff' }}
            >
              Odemčeno!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for floating nav */}
      <div style={{ height: theme.navH, flexShrink: 0 }} />

      {/* Floating bottom nav */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 22,
        display: 'flex', justifyContent: 'center', gap: 14,
        pointerEvents: 'none', zIndex: 100,
      }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 18, padding: '8px 18px',
            fontFamily: 'Nunito, sans-serif', color: theme.ink, fontWeight: 800,
            boxShadow: block(4), cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 24 }}>🗺️</span>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.3 }}>MAPA</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigateTo('shop')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.card, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 18, padding: '8px 18px',
            fontFamily: 'Nunito, sans-serif', color: theme.ink, fontWeight: 800,
            boxShadow: block(4), cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 24 }}>🎒</span>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.3 }}>BATOH</span>
        </motion.button>
      </div>
    </ScreenShell>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 4: Start dev server, open in browser, verify HomeScreen visually**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run dev`
Navigate to `localhost:5173`. Check: sky gradient background, clouds, horizontal carousel, floating 2-button nav, parchment HUD chips, ComboPips.

- [ ] **Step 5: Commit**

```bash
git add src/components/screens/HomeScreen.tsx src/components/ui/WorldCard.tsx
git commit -m "feat: redesign HomeScreen with journey carousel and floating nav"
```

---

### Task 7: Redesign GameScreen and MathTask

**Files:**
- Modify: `src/components/screens/GameScreen.tsx`
- Modify: `src/components/tasks/MathTask.tsx`

- [ ] **Step 1: Update GameScreen.tsx**

In `GameScreen.tsx`, apply these changes:
1. Import `ScreenShell`, `Cloud`, `ComboBar`, `theme`, `skyFull`, `block`
2. Wrap content in `<ScreenShell background={skyFull}>` instead of bare `<div className="screen">`
3. Add `<Cloud>` components after `<ScreenShell>`
4. Replace the back button with a `GameHeader` chip (parchment pill with "← Mapa" + world/task info)
5. Add `<ComboBar combo={combo} />` below the header
6. Add nav spacer `<div style={{ height: theme.navH, flexShrink: 0 }} />`
7. Update the series overlay to use warm brown backdrop (`rgba(43, 29, 16, 0.78)`) and gold text colors
8. Keep all game logic, handleAnswer, handleBackHome, shakeControls, etc. exactly the same

The GameHeader chip (inline, not a separate component):
```tsx
<div style={{ padding: '0 12px 6px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
  <motion.button
    whileTap={{ scale: 0.94 }}
    onClick={handleBackHome}
    style={{
      background: theme.card, border: `3px solid ${theme.cardEdge}`,
      borderRadius: 999, padding: '4px 10px 4px 6px',
      display: 'flex', alignItems: 'center', gap: 4,
      fontFamily: 'inherit', fontSize: 12, fontWeight: 900, color: theme.ink,
      boxShadow: block(3), cursor: 'pointer',
    }}
  >
    <span style={{ fontSize: 16 }}>←</span> Mapa
  </motion.button>
  <div style={{
    background: 'rgba(255,255,255,0.7)', borderRadius: 999, padding: '4px 10px',
    fontSize: 12, fontWeight: 800, color: theme.ink,
    border: `2px solid ${theme.cardEdge}`,
  }}>
    {world?.icon} {world?.name}
  </div>
</div>
```

- [ ] **Step 2: Rewrite MathTask.tsx**

Replace the entire content of `src/components/tasks/MathTask.tsx`:

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#f5b90d', edge: '#a06d04' },
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#e64a3a', edge: '#8a2418' },
]

export function MathTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | string | null>(null)

  function handleSelect(opt: number | string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  // Take first 4 options (design uses 2x2 grid)
  const options = (task.options ?? []).slice(0, 4)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 26, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard>{task.question}</SignBoard>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14, width: '100%', maxWidth: 280, marginTop: 8,
      }}>
        {options.map((opt, i) => (
          <CubeButton
            key={opt}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            onClick={() => handleSelect(opt)}
            className={selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 4: Test visually**

Open dev server, enter a world, verify: SignBoard question, 2×2 colored CubeButtons, sky background, ComboPips, GameHeader chip.

- [ ] **Step 5: Commit**

```bash
git add src/components/screens/GameScreen.tsx src/components/tasks/MathTask.tsx
git commit -m "feat: redesign GameScreen shell and MathTask with SignBoard + CubeButtons"
```

---

### Task 8: Redesign remaining task components

**Files:**
- Modify: `src/components/tasks/CountingTask.tsx`
- Modify: `src/components/tasks/CompareTask.tsx`
- Modify: `src/components/tasks/MissingLetterTask.tsx`
- Modify: `src/components/tasks/MultiChoiceTask.tsx`
- Modify: `src/components/tasks/FindTask.tsx`
- Modify: `src/components/tasks/EngPictureTask.tsx`

- [ ] **Step 1: Rewrite CountingTask.tsx**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#f5b90d', edge: '#a06d04' },
]

export function CountingTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | string | null>(null)

  function handleSelect(opt: number | string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  const options = (task.options ?? []).slice(0, 3)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 22, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={26}>{task.question}</SignBoard>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#e8d6a8', border: `4px solid ${theme.cardEdge}`,
          borderRadius: 12, padding: '14px 20px',
          boxShadow: block(4),
          display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
          maxWidth: 280,
        }}
      >
        {task.objects?.map((obj, i) => (
          (obj.startsWith('/') || obj.startsWith('http'))
            ? <img key={i} src={obj} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            : <span key={i} style={{ fontSize: 36, lineHeight: 1 }}>{obj}</span>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 10, width: '100%', maxWidth: 280 }}>
        {options.map((opt, i) => (
          <CubeButton
            key={opt}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            size="sm"
            onClick={() => handleSelect(opt)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite CompareTask.tsx**

```tsx
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CompareTask({ task, onAnswer }: Props) {
  const [a, b] = task.options ?? [0, 0]
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <CubeButton label={a} color="#f5b90d" edge="#a06d04" size="lg" onClick={() => onAnswer(a)} />
        <div style={{
          fontSize: 44, fontWeight: 900, color: theme.ink,
          textShadow: '0 2px 0 rgba(255,255,255,0.5)',
        }}>?</div>
        <CubeButton label={b} color="#3ac8d1" edge="#1d7a80" size="lg" onClick={() => onAnswer(b)} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite MissingLetterTask.tsx**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#f5b90d', edge: '#a06d04' },
  { color: '#e64a3a', edge: '#8a2418' },
]

export function MissingLetterTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  // Split the question into characters — the '_' is the missing slot
  const chars = task.question.split('')

  const options = (task.options as string[]).slice(0, 4)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>Doplň písmenko</SignBoard>

      <div style={{ display: 'flex', gap: 6 }}>
        {chars.map((ch, i) => {
          const isMissing = ch === '_'
          return (
            <div key={i} style={{
              width: 50, height: 60, borderRadius: 10,
              background: isMissing ? theme.gold : theme.card,
              border: `4px solid ${isMissing ? theme.goldDeep : theme.cardEdge}`,
              boxShadow: block(4, isMissing ? theme.goldDeep : theme.cardEdge),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 900, color: theme.ink,
              animation: isMissing ? 'pulse 1.2s ease-in-out infinite' : 'none',
            }}>{isMissing ? '_' : ch}</div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8, width: '100%', maxWidth: 320 }}>
        {options.map((opt, i) => (
          <CubeButton
            key={opt}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            size="sm"
            onClick={() => handleSelect(opt)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite MultiChoiceTask.tsx, FindTask.tsx, EngPictureTask.tsx**

Apply the same pattern: wrap in a flex-column centered container, use `SignBoard` for the question, use 2×2 `CubeButton` grid for options. These all follow the same template as `MathTask` — `SignBoard` + `CubeButton` grid. For `MultiChoiceTask` and `EngPictureTask`, keep the object grid but restyle it with the wooden box background (`#e8d6a8`) like `CountingTask`. For `FindTask`, use `SignBoard` + 2×2 CubeButtons.

- [ ] **Step 5: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 6: Test visually**

Open dev server, play through each world to trigger different task types. Verify: SignBoard question display, CubeButton answers, wooden box for object grids, letter tiles with pulse animation.

- [ ] **Step 7: Commit**

```bash
git add src/components/tasks/CountingTask.tsx src/components/tasks/CompareTask.tsx src/components/tasks/MissingLetterTask.tsx src/components/tasks/MultiChoiceTask.tsx src/components/tasks/FindTask.tsx src/components/tasks/EngPictureTask.tsx
git commit -m "feat: redesign all task components with SignBoard + CubeButton"
```

---

### Task 9: Redesign RewardScreen

**Files:**
- Modify: `src/components/screens/RewardScreen.tsx`

- [ ] **Step 1: Rewrite RewardScreen.tsx**

Replace the entire content:

```tsx
// src/components/screens/RewardScreen.tsx
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { REWARD_SCREEN_DURATION, COMBO_REWARDS, getComboLevel } from '../../data/config'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { RewardChip } from '../ui/RewardChip'
import { theme, block, blockInset, skyFull } from '../../theme'
import { playSound } from '../../audio/sounds'

interface Props { onDone: () => void }

export function RewardScreen({ onDone }: Props) {
  const { combo } = useGameStore()
  const info = getComboInfo(combo)
  const level = getComboLevel(combo)
  const rewards = COMBO_REWARDS[level]

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    playSound.reward()
    timerRef.current = setTimeout(onDone, REWARD_SCREEN_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onDone])

  function handleSkip() {
    if (timerRef.current) clearTimeout(timerRef.current)
    onDone()
  }

  return (
    <ScreenShell background={skyFull}>
      <Cloud style={{ top: 60, left: 30, opacity: 0.7 }} />
      <Cloud style={{ top: 100, right: 20, opacity: 0.5, transform: 'scale(0.8)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '20px 24px' }}>
        {/* Big check on a glowing ray burst */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{ position: 'relative' }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2
              const x1 = 90 + Math.cos(a) * 40, y1 = 90 + Math.sin(a) * 40
              const x2 = 90 + Math.cos(a) * 80, y2 = 90 + Math.sin(a) * 80
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.gold} strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            })}
          </svg>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: theme.grass1, border: `5px solid ${theme.cardEdge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 70, position: 'relative', zIndex: 1,
            boxShadow: `${blockInset}, 0 8px 0 ${theme.grass2}`,
          }}>✓</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{
            fontSize: 32, fontWeight: 900, color: theme.ink,
            textShadow: '0 2px 0 rgba(255,255,255,0.5)', letterSpacing: 1,
          }}
        >
          SUPER!
        </motion.div>

        {/* Reward chips */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: 8 }}
        >
          {rewards.diamonds && <RewardChip icon="💎" value={`+${rewards.diamonds}`} tint={theme.diamond} />}
          {rewards.emeralds && <RewardChip icon="🟢" value={`+${rewards.emeralds}`} tint={theme.emerald} />}
          {rewards.stars && <RewardChip icon="⭐" value={`+${rewards.stars}`} tint={theme.star} />}
        </motion.div>

        {/* Combo flame card */}
        {combo > 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
            style={{
              background: theme.card, border: `3px solid ${theme.cardEdge}`, borderRadius: 14,
              padding: '8px 16px', boxShadow: block(3),
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>🔥</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: theme.inkSoft }}>SÉRIE</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: theme.ink, lineHeight: 1 }}>{combo}× v řadě</div>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.94 }}
          style={{
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 14, padding: '10px 22px', marginTop: 8,
            fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900,
            color: theme.ink, cursor: 'pointer', boxShadow: block(4, theme.goldDeep),
          }}
        >
          Dál →
        </motion.button>
      </div>
    </ScreenShell>
  )
}
```

- [ ] **Step 2: Verify build and test visually**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Then test: answer a task correctly, verify RewardScreen shows ray burst, green check, "SUPER!", RewardChip pills, combo card.

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/RewardScreen.tsx
git commit -m "feat: redesign RewardScreen with ray burst and parchment chips"
```

---

### Task 10: Redesign ShopScreen

**Files:**
- Modify: `src/components/screens/ShopScreen.tsx`

- [ ] **Step 1: Rewrite ShopScreen.tsx**

Apply the redesign: `ScreenShell` + `skyShort` background, Cloud, parchment main tabs (Obchod/Vitrína as card buttons), category pills (rounded, gold active), item cards with parchment background + rarity borders + owned check badge + gold price pill. Floating 2-button nav at bottom. Showcase tab with 4×2 slot grid (parchment + gold for filled, dashed for empty).

Key changes to make:
1. Wrap in `<ScreenShell background={skyShort}>`
2. Add `<Cloud style={{ top: 80, left: 24, opacity: 0.7 }} />`
3. Replace section-title tabs with `ShopMainTabs` — two parchment card buttons
4. Replace `.shop-tabs` with rounded pill buttons: active gets gold background
5. Replace `.shop-grid` item cards with parchment cards (`theme.card` background, `borderRadius: 12`, `block(3)` shadow)
6. Owned badge: green circle ✓ at top-right corner
7. Price: gold pill with icon + cost
8. Rarity: epic = purple border, legendary = gold gradient bg
9. Replace `.bottom-nav` with floating 2-button nav
10. Add nav spacer

Keep all logic (handleBuy, canAfford, selectedSlot, etc.) exactly the same.

- [ ] **Step 2: Verify build and test visually**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Test: navigate to Shop, check both tabs, verify parchment cards, category pills, rarity borders, showcase slots.

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/ShopScreen.tsx
git commit -m "feat: redesign ShopScreen with parchment cards and pill tabs"
```

---

### Task 11: Redesign ProfileScreen

**Files:**
- Modify: `src/components/screens/ProfileScreen.tsx`

- [ ] **Step 1: Rewrite ProfileScreen.tsx**

Apply the redesign:
1. Wrap in `<ScreenShell background={skyShort}>`
2. Add Cloud
3. **Hero card**: large parchment card (`theme.card`, `block(5)`) with 64px avatar emoji, name, XP bar (parchment track + green fill), level info
4. **Stats**: `SectionTitle` ("📊 Statistiky") + 2×2 grid of parchment stat cards (`block(3)`)
5. **Badges**: `SectionTitle` ("🏅 Odznaky") + 3-column grid. Earned: parchment + gold border + `block(3, goldDeep)`. Unearned: translucent, `opacity: 0.55`, `grayscale(1)` on icon.
6. Keep skill bars and world list sections, just restyle with parchment backgrounds
7. Replace `.bottom-nav` with floating 2-button nav + spacer
8. Keep all logic (copyChildId, etc.) exactly the same

- [ ] **Step 2: Verify build and test visually**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Test: navigate to Profile, verify hero card, stat grid, badge grid, skill bars.

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/ProfileScreen.tsx
git commit -m "feat: redesign ProfileScreen with hero card and parchment stats"
```

---

### Task 12: Redesign overlays (LevelUp, LuckyWheel, MysteryChest)

**Files:**
- Modify: `src/components/ui/LevelUpOverlay.tsx`
- Modify: `src/components/ui/LuckyWheel.tsx`
- Modify: `src/components/ui/MysteryChest.tsx`

- [ ] **Step 1: Rewrite LevelUpOverlay.tsx**

Use `OverlayBackdrop` wrapper. Inside: parchment card (`theme.card`, `borderRadius: 22`, `block(6)`), "★ NOVÝ LEVEL ★" header in `goldDeep`, golden gradient circle (110px, `radial-gradient(circle at 30% 30%, #fff5b8, #f5b90d 60%, #b67806 100%)`) with level number in white, "Level N!" text, encouragement text, `ButtonPrimary` "Super! 🎉". Keep all logic (handleCollect, spawnParticles) exactly the same.

- [ ] **Step 2: Rewrite LuckyWheel.tsx**

Use `OverlayBackdrop` wrapper. Inside: parchment card (`theme.card`, `borderRadius: 22`, `block(6)`), "🎡 Šťastné kolo" header, SVG wheel with 6 colored slices using theme colors (diamond, gold, emerald, star, purple), `3px stroke cardEdge`, gold center circle, red triangle pointer at top. `ButtonPrimary` "ROZTOČIT". Keep all logic (spin, resultReward, onCollect) exactly the same.

- [ ] **Step 3: Rewrite MysteryChest.tsx**

Use `OverlayBackdrop` wrapper. Inside: parchment card, "TAJEMNÁ TRUHLA" header in `goldDeep`, keep existing chest image but add sparkle emojis around it, restyle tap counter with parchment + theme colors. `ButtonPrimary` for "OTEVŘÍT" / reward collect. Keep all logic (handleTap, tapsLeft, chestType, tier system) exactly the same.

- [ ] **Step 4: Verify build and test visually**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Test: trigger each overlay (answer 15 correct for chest, level up, wheel). Verify parchment cards, warm brown backdrop, gold buttons.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/LevelUpOverlay.tsx src/components/ui/LuckyWheel.tsx src/components/ui/MysteryChest.tsx
git commit -m "feat: redesign overlays with OverlayBackdrop and parchment cards"
```

---

### Task 13: Restyle PixelButton and clean up unused CSS

**Files:**
- Modify: `src/components/ui/PixelButton.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Restyle PixelButton.tsx**

Update `PixelButton` to use parchment/wood aesthetic: `theme.card` background, `theme.cardEdge` border, `block(3)` shadow, `borderRadius: 14`. Variants: `primary` = gold background, `gold` = gold background, `danger` = red background.

- [ ] **Step 2: Clean up styles.css**

Remove unused dark-themed CSS classes that are now replaced by inline styles:
- `.hud`, `.hud-currency`, `.hud-combo` (now inline in HUD.tsx)
- `.combo-bar-wrap`, `.combo-bar-fill` (now inline in ComboBar.tsx)
- `.world-card`, `.world-block`, `.world-block-icon`, `.world-name`, `.world-cost`, `.lock-badge` (now inline in WorldCard.tsx)
- `.task-area`, `.task-question` (now inline in task components)
- `.answer-grid`, `.answer-btn` (replaced by CubeButton)
- `.compare-row`, `.compare-box` (replaced by CubeButton)
- `.find-grid`, `.find-btn` (replaced by CubeButton)
- `.object-grid` (now inline in CountingTask)
- `.reward-screen`, `.reward-check`, `.reward-title`, `.reward-gems`, `.reward-combo-label` (now inline)
- `.series-overlay`, `.series-trophy`, `.series-title`, `.series-sub` (now inline)
- `.bottom-nav`, `.nav-btn` (now inline floating nav)
- `.section-title` (now inline)
- Old dark color variables that are no longer referenced

Keep:
- `.screen` (still used by App.tsx AnimatePresence)
- `.pixel-btn` (updated to new style)
- `.shop-*` classes if they are still referenced
- `.showcase-*` classes if still referenced
- `.stat-row` if still referenced
- `.drag-*` classes (DragDropTask not restyled in this pass)
- `.runner-*` classes (RunnerTask not restyled in this pass)

- [ ] **Step 3: Verify build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds with no errors

- [ ] **Step 4: Full visual regression test**

Open dev server and test all screens:
1. Home — sky gradient, clouds, horizontal carousel, floating nav
2. Game — sky gradient, GameHeader, ComboPips, SignBoard, CubeButtons
3. Reward — ray burst, green check, "SUPER!", RewardChip pills
4. Shop — parchment tabs, pill categories, parchment cards
5. Profile — hero card, stat grid, badge grid
6. Overlays — trigger LevelUp, LuckyWheel, MysteryChest

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/PixelButton.tsx src/styles.css
git commit -m "feat: restyle PixelButton and clean up unused dark CSS"
```

---

### Task 14: Final build verification and test run

- [ ] **Step 1: Run full build**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build`
Expected: build succeeds

- [ ] **Step 2: Run tests**

Run: `cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run test:run`
Expected: all tests pass (no functional changes were made)

- [ ] **Step 3: Final visual check**

Open dev server, play through a complete session: select world → answer tasks → reward → combo → series complete → shop → profile. Verify all screens look correct with the new sky-over-grass palette.
