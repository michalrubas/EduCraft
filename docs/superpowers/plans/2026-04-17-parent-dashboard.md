# Parent Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Periodicky synchronizovat herní stav do Supabase a zobrazit ho na rodičovském dashboardu na `/parent`.

**Architecture:** Hra zůstává beze změny. `useSupabaseSync` hook v `App.tsx` subscribuje na Zustand store a s 1minutovým debounce vkládá snapshot do Supabase. `main.tsx` routuje `/parent` na `ParentDashboard`, který fetchuje poslední snapshot pomocí `childId`.

**Tech Stack:** React 18, Zustand 5, Vitest + jsdom, `@supabase/supabase-js`, Supabase (Postgres + anon key)

---

## File Map

| Soubor | Akce | Zodpovědnost |
|--------|------|--------------|
| `src/lib/supabase.ts` | Vytvořit | Inicializace Supabase klienta |
| `src/hooks/useSupabaseSync.ts` | Vytvořit | childId, debounce, insert do Supabase |
| `src/components/screens/ParentDashboard.tsx` | Vytvořit | `/parent` UI — input childId, fetch, zobrazení |
| `src/test/serializeSnapshot.test.ts` | Vytvořit | Testy pro `serializeSnapshot` |
| `src/test/useSupabaseSync.test.ts` | Vytvořit | Testy pro `getOrCreateChildId` |
| `src/test/ParentDashboard.test.tsx` | Vytvořit | Testy render stavů dashboardu |
| `src/main.tsx` | Upravit | Pathname routing: `/parent` → ParentDashboard |
| `src/App.tsx` | Upravit | Přidat volání `useSupabaseSync()` |
| `.env.example` | Vytvořit | Šablona env vars |
| `.env` | Upravit | Přidat Supabase credentials (necommitovat) |

---

## Task 1: Supabase tabulka a env vars

**Files:**
- Create: `.env.example`
- Modify: `.env` (lokálně, necommitovat)

- [ ] **Step 1: Vytvoř Supabase tabulku**

V Supabase dashboardu (SQL editor) spusť:

```sql
create table child_snapshots (
  id         uuid primary key default gen_random_uuid(),
  child_id   text not null,
  snapshot   jsonb not null,
  synced_at  timestamptz default now()
);

create index on child_snapshots (child_id, synced_at desc);

alter table child_snapshots enable row level security;
create policy "allow all for anon" on child_snapshots
  for all
  using (true)
  with check (true);
```

- [ ] **Step 2: Zkopíruj credentials**

V Supabase dashboardu: Settings → API → zkopíruj `Project URL` a `anon public` key.

- [ ] **Step 3: Vytvoř `.env.example`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] **Step 4: Přidej credentials do `.env`**

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] **Step 5: Zkontroluj `.gitignore`**

Ověř, že `.env` je v `.gitignore` (ale `.env.example` ne).

- [ ] **Step 6: Nainstaluj `@supabase/supabase-js`**

```bash
npm install @supabase/supabase-js
```

Expected: package přidán do `package.json` dependencies.

- [ ] **Step 7: Commit**

```bash
git add .env.example package.json package-lock.json
git commit -m "feat(parent-dashboard): add supabase dep and env template"
```

---

## Task 2: Supabase klient

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Vytvoř `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat(parent-dashboard): add supabase client"
```

---

## Task 3: Snapshot serializer + testy

Extrahujeme `serializeSnapshot` jako čistou funkci — snadno testovatelnou a přehlednou.

**Files:**
- Create: `src/hooks/useSupabaseSync.ts` (jen export `serializeSnapshot` a `getOrCreateChildId`)
- Create: `src/test/serializeSnapshot.test.ts`
- Create: `src/test/useSupabaseSync.test.ts`

- [ ] **Step 1: Napiš failing test pro `serializeSnapshot`**

Vytvoř `src/test/serializeSnapshot.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { serializeSnapshot } from '../hooks/useSupabaseSync'
import type { GameState } from '../data/types'

const mockState = {
  level: 3,
  xp: 250,
  combo: 5,
  maxCombo: 12,
  diamonds: 42,
  emeralds: 7,
  stars: 1,
  totalCorrect: 100,
  totalAttempts: 120,
  sessionsPlayed: 8,
  totalCorrectSession: 15,
  unlockedWorlds: ['forest', 'cave'],
  ownedItems: ['sword_wood'],
  showcaseSlots: [null, 'sword_wood', null],
  unlockedBadges: ['first_correct'],
  studentProgress: {
    add_no_regroup: { mastery: 0.8, unlocked: true, attempts: 20, lastPracticed: 1000 },
  },
  worldAccuracy: { forest: { correct: 80, total: 100 } },
  muted: false,
  // funkce — nesmí být v snapshotu
  navigateTo: () => {},
  enterWorld: () => {},
  answerCorrect: () => false,
} as unknown as GameState

describe('serializeSnapshot', () => {
  it('includes all expected fields', () => {
    const result = serializeSnapshot(mockState)
    expect(result.level).toBe(3)
    expect(result.xp).toBe(250)
    expect(result.diamonds).toBe(42)
    expect(result.studentProgress).toEqual(mockState.studentProgress)
    expect(result.worldAccuracy).toEqual(mockState.worldAccuracy)
  })

  it('excludes functions', () => {
    const result = serializeSnapshot(mockState)
    expect((result as Record<string, unknown>).navigateTo).toBeUndefined()
    expect((result as Record<string, unknown>).answerCorrect).toBeUndefined()
  })

  it('includes all 18 expected keys', () => {
    const result = serializeSnapshot(mockState)
    const keys = Object.keys(result)
    expect(keys).toContain('level')
    expect(keys).toContain('xp')
    expect(keys).toContain('combo')
    expect(keys).toContain('maxCombo')
    expect(keys).toContain('diamonds')
    expect(keys).toContain('emeralds')
    expect(keys).toContain('stars')
    expect(keys).toContain('totalCorrect')
    expect(keys).toContain('totalAttempts')
    expect(keys).toContain('sessionsPlayed')
    expect(keys).toContain('totalCorrectSession')
    expect(keys).toContain('unlockedWorlds')
    expect(keys).toContain('ownedItems')
    expect(keys).toContain('showcaseSlots')
    expect(keys).toContain('unlockedBadges')
    expect(keys).toContain('studentProgress')
    expect(keys).toContain('worldAccuracy')
    expect(keys).toContain('muted')
  })
})
```

- [ ] **Step 2: Spusť test, ověř že padá**

```bash
npm test -- serializeSnapshot
```

Expected: FAIL — `serializeSnapshot` is not exported

- [ ] **Step 3: Napiš failing test pro `getOrCreateChildId`**

Vytvoř `src/test/useSupabaseSync.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { getOrCreateChildId } from '../hooks/useSupabaseSync'

describe('getOrCreateChildId', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates a UUID and stores it on first call', () => {
    const id = getOrCreateChildId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(localStorage.getItem('educraft-child-id')).toBe(id)
  })

  it('returns the same ID on subsequent calls', () => {
    const id1 = getOrCreateChildId()
    const id2 = getOrCreateChildId()
    expect(id1).toBe(id2)
  })

  it('reads existing ID from localStorage', () => {
    localStorage.setItem('educraft-child-id', 'existing-id-123')
    const id = getOrCreateChildId()
    expect(id).toBe('existing-id-123')
  })
})
```

- [ ] **Step 4: Spusť test, ověř že padá**

```bash
npm test -- useSupabaseSync
```

Expected: FAIL — `getOrCreateChildId` is not exported

- [ ] **Step 5: Implementuj `src/hooks/useSupabaseSync.ts`**

```typescript
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { supabase } from '../lib/supabase'
import type { GameState } from '../data/types'

const CHILD_ID_KEY = 'educraft-child-id'
const SYNC_DEBOUNCE_MS = 60_000

export type SnapshotPayload = {
  level: number
  xp: number
  combo: number
  maxCombo: number
  diamonds: number
  emeralds: number
  stars: number
  totalCorrect: number
  totalAttempts: number
  sessionsPlayed: number
  totalCorrectSession: number
  unlockedWorlds: string[]
  ownedItems: string[]
  showcaseSlots: (string | null)[]
  unlockedBadges: string[]
  studentProgress: GameState['studentProgress']
  worldAccuracy: GameState['worldAccuracy']
  muted: boolean
}

export function serializeSnapshot(state: GameState): SnapshotPayload {
  return {
    level: state.level,
    xp: state.xp,
    combo: state.combo,
    maxCombo: state.maxCombo,
    diamonds: state.diamonds,
    emeralds: state.emeralds,
    stars: state.stars,
    totalCorrect: state.totalCorrect,
    totalAttempts: state.totalAttempts,
    sessionsPlayed: state.sessionsPlayed,
    totalCorrectSession: state.totalCorrectSession,
    unlockedWorlds: state.unlockedWorlds,
    ownedItems: state.ownedItems,
    showcaseSlots: state.showcaseSlots,
    unlockedBadges: state.unlockedBadges,
    studentProgress: state.studentProgress,
    worldAccuracy: state.worldAccuracy,
    muted: state.muted,
  }
}

export function getOrCreateChildId(): string {
  let id = localStorage.getItem(CHILD_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CHILD_ID_KEY, id)
  }
  return id
}

export function useSupabaseSync() {
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return

    const childId = getOrCreateChildId()
    let timer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = useGameStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(async () => {
        await supabase.from('child_snapshots').insert({
          child_id: childId,
          snapshot: serializeSnapshot(state),
        })
      }, SYNC_DEBOUNCE_MS)
    })

    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [])
}
```

- [ ] **Step 6: Spusť testy, ověř že prochází**

```bash
npm test -- serializeSnapshot useSupabaseSync
```

Expected: PASS (všechny testy)

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useSupabaseSync.ts src/test/serializeSnapshot.test.ts src/test/useSupabaseSync.test.ts
git commit -m "feat(parent-dashboard): add sync hook with serializer and tests"
```

---

## Task 4: Routing v `main.tsx` + volání hooku v `App.tsx`

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Přečti `src/App.tsx`**

Přečti soubor a najdi první řádky komponenty `App` — tam přidáme hook.

- [ ] **Step 2: Přidej `useSupabaseSync()` do `App.tsx`**

Na začátek těla funkce `App` přidej jeden řádek:

```typescript
import { useSupabaseSync } from './hooks/useSupabaseSync'

export default function App() {
  useSupabaseSync()  // ← přidat tento řádek
  // ... zbytek komponenty beze změny
}
```

- [ ] **Step 3: Uprav `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ParentDashboard from './components/screens/ParentDashboard'
import './styles.css'
import { registerServiceWorker } from './pwa'

const isParent = window.location.pathname === '/parent'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isParent ? <ParentDashboard /> : <App />}
  </React.StrictMode>,
)

registerServiceWorker()
```

- [ ] **Step 4: Spusť existující testy, ověř žádné regresy**

```bash
npm test
```

Expected: PASS (App.tsx import ParentDashboard selže protože ještě neexistuje — OK, test selže na import)

- [ ] **Step 5: Commit (po Task 5 kdy ParentDashboard bude existovat)**

Commit provedeme společně s Task 5.

---

## Task 5: ParentDashboard komponenta + testy

**Files:**
- Create: `src/components/screens/ParentDashboard.tsx`
- Create: `src/test/ParentDashboard.test.tsx`

- [ ] **Step 1: Napiš failing testy**

Vytvoř `src/test/ParentDashboard.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ParentDashboard from '../components/screens/ParentDashboard'

// Mock supabase klient
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  synced_at: '2026-04-17T10:00:00Z',
                  snapshot: {
                    level: 5,
                    xp: 500,
                    diamonds: 42,
                    emeralds: 7,
                    stars: 1,
                    totalCorrect: 100,
                    totalAttempts: 120,
                    maxCombo: 15,
                    unlockedBadges: ['first_correct'],
                    studentProgress: {},
                    worldAccuracy: {},
                    unlockedWorlds: ['forest'],
                  },
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }),
  },
}))

describe('ParentDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders child ID input on load', () => {
    render(<ParentDashboard />)
    expect(screen.getByPlaceholderText(/child id/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /načíst/i })).toBeInTheDocument()
  })

  it('prefills input from localStorage', () => {
    localStorage.setItem('educraft-parent-child-id', 'saved-id-abc')
    render(<ParentDashboard />)
    expect(screen.getByPlaceholderText(/child id/i)).toHaveValue('saved-id-abc')
  })

  it('shows data after successful load', async () => {
    render(<ParentDashboard />)
    fireEvent.change(screen.getByPlaceholderText(/child id/i), {
      target: { value: 'test-child-id' },
    })
    fireEvent.click(screen.getByRole('button', { name: /načíst/i }))
    await waitFor(() => {
      expect(screen.getByText(/level/i)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Spusť test, ověř že padá**

```bash
npm test -- ParentDashboard
```

Expected: FAIL — `ParentDashboard` not found

- [ ] **Step 3: Implementuj `src/components/screens/ParentDashboard.tsx`**

```tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SnapshotPayload } from '../../hooks/useSupabaseSync'

const PARENT_CHILD_ID_KEY = 'educraft-parent-child-id'

type RowData = {
  snapshot: SnapshotPayload
  synced_at: string
}

export default function ParentDashboard() {
  const [input, setInput] = useState(
    () => localStorage.getItem(PARENT_CHILD_ID_KEY) ?? ''
  )
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [row, setRow] = useState<RowData | null>(null)

  async function load() {
    if (!input.trim()) return
    setStatus('loading')
    const { data, error } = await supabase
      .from('child_snapshots')
      .select('snapshot, synced_at')
      .eq('child_id', input.trim())
      .order('synced_at', { ascending: false })
      .limit(1)

    if (error || !data?.length) {
      setStatus('error')
      return
    }

    localStorage.setItem(PARENT_CHILD_ID_KEY, input.trim())
    setRow(data[0] as RowData)
    setStatus('loaded')
  }

  const s = row?.snapshot

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Rodičovský dashboard</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Child ID"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          style={{ flex: 1, padding: 8, fontSize: 14 }}
        />
        <button onClick={load} disabled={status === 'loading'} style={{ padding: '8px 16px' }}>
          Načíst
        </button>
      </div>

      {status === 'loading' && <p>Načítám...</p>}

      {status === 'error' && (
        <p style={{ color: 'red' }}>ID nenalezeno nebo chyba připojení.</p>
      )}

      {status === 'loaded' && s && (
        <div>
          <p style={{ color: 'gray', fontSize: 12 }}>
            Poslední sync: {new Date(row!.synced_at).toLocaleString('cs-CZ')}
            {' '}
            <button onClick={load} style={{ fontSize: 12, padding: '2px 8px' }}>↻ Obnovit</button>
          </p>

          <section>
            <h2>Postup</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                <tr><td>Level</td><td>{s.level}</td></tr>
                <tr><td>XP</td><td>{s.xp}</td></tr>
                <tr><td>Max combo</td><td>{s.maxCombo}</td></tr>
                <tr><td>Správně celkem</td><td>{s.totalCorrect} / {s.totalAttempts}</td></tr>
                <tr><td>Přesnost</td><td>{s.totalAttempts > 0 ? Math.round(s.totalCorrect / s.totalAttempts * 100) : 0} %</td></tr>
                <tr><td>Sezení</td><td>{s.sessionsPlayed}</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Měna & předměty</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                <tr><td>💰 Diamanty</td><td>{s.diamonds}</td></tr>
                <tr><td>💎 Smaragdy</td><td>{s.emeralds}</td></tr>
                <tr><td>⬛ Hvězdy</td><td>{s.stars}</td></tr>
                <tr><td>Vlastněné předměty</td><td>{s.ownedItems.length}</td></tr>
                <tr><td>Odznaky</td><td>{s.unlockedBadges.length}</td></tr>
                <tr><td>Odemčené světy</td><td>{s.unlockedWorlds.join(', ')}</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Dovednosti</h2>
            {Object.entries(s.studentProgress).map(([skillId, skill]) => (
              <div key={skillId} style={{ marginBottom: 6 }}>
                <span style={{ display: 'inline-block', width: 200, fontSize: 13 }}>{skillId}</span>
                <span style={{ display: 'inline-block', width: 60, fontSize: 13 }}>
                  {Math.round(skill.mastery * 100)} %
                </span>
                <div style={{ display: 'inline-block', width: 120, height: 8, background: '#eee', borderRadius: 4 }}>
                  <div style={{ width: `${skill.mastery * 100}%`, height: '100%', background: skill.mastery > 0.75 ? '#4caf50' : skill.mastery > 0.2 ? '#ff9800' : '#f44336', borderRadius: 4 }} />
                </div>
                {!skill.unlocked && <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>🔒</span>}
              </div>
            ))}
          </section>

          <section>
            <h2>Přesnost per svět</h2>
            {Object.entries(s.worldAccuracy).map(([worldId, acc]) => (
              <div key={worldId} style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>{worldId}</strong>: {acc.correct} / {acc.total} ({acc.total > 0 ? Math.round(acc.correct / acc.total * 100) : 0} %)
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Spusť testy, ověř že prochází**

```bash
npm test -- ParentDashboard
```

Expected: PASS

- [ ] **Step 5: Spusť všechny testy**

```bash
npm test
```

Expected: PASS (žádné regresy)

- [ ] **Step 6: Commit**

```bash
git add src/components/screens/ParentDashboard.tsx src/test/ParentDashboard.test.tsx src/main.tsx src/App.tsx
git commit -m "feat(parent-dashboard): add dashboard UI, routing and sync hook integration"
```

---

## Task 6: Manuální smoke test

- [ ] **Step 1: Spusť dev server**

```bash
npm run dev
```

- [ ] **Step 2: Ověř sync ze hry**

1. Otevři `http://localhost:5173` (hra)
2. Zahraj pár odpovědí
3. Otevři Supabase Table Editor → tabulka `child_snapshots`
4. Po cca 1 minutě inaktivity se má objevit nový řádek
5. Zkontroluj, že `snapshot` jsonb obsahuje správná data

- [ ] **Step 3: Ověř `childId`**

1. V DevTools → Application → localStorage
2. Klíč `educraft-child-id` musí existovat a obsahovat UUID

- [ ] **Step 4: Ověř rodičovský dashboard**

1. Otevři `http://localhost:5173/parent`
2. Musí se zobrazit input (ne hra)
3. Vlož `childId` z kroku 3, klikni Načíst
4. Musí se zobrazit data dítěte

- [ ] **Step 5: Ověř persistenci `childId` v dashboardu**

1. Refreshni `/parent`
2. Input musí být předvyplněn (uložen v localStorage)

- [ ] **Step 6: Finální commit pokud bylo cokoliv opraveno**

```bash
git add -p
git commit -m "fix(parent-dashboard): smoke test fixes"
```
