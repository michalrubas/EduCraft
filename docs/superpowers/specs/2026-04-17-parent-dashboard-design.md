# Parent Dashboard — Design Spec
**Date:** 2026-04-17

## Overview

Rodičovský dashboard umožňuje rodiči sledovat herní statistiky dítěte v prohlížeči (mobil i desktop). Hra periodicky odesílá snapshot herního stavu do Supabase. Rodič zadá `childId` a vidí aktuální data.

Klíčový princip: **nulový zásah do existující herní architektury**. Hra o syncu neví — sync probíhá jako side-effect na pozadí.

---

## Architektura

### Datový tok

```
Hra (localStorage / Zustand)
  └─ useSupabaseSync hook (1min debounce)
       └─ INSERT do Supabase child_snapshots
            └─ ParentDashboard čte poslední snapshot pro dané childId
```

### Identifikace dítěte

- Při prvním spuštění hry se vygeneruje `childId` pomocí `crypto.randomUUID()`.
- `childId` se uloží do `localStorage` (odděleně od herního stavu, pod klíčem `educraft-child-id`).
- Rodič zadá `childId` ručně do dashboardu — kdo zná ID, vidí data.
- Žádná autentizace, žádné účty.

---

## Supabase

### Tabulka

```sql
create table child_snapshots (
  id         uuid primary key default gen_random_uuid(),
  child_id   text not null,
  snapshot   jsonb not null,
  synced_at  timestamptz default now()
);

create index on child_snapshots (child_id, synced_at desc);
```

- Každý sync = nový `INSERT` (žádný upsert).
- Historická data jsou zachována pro budoucí analytiku.
- Při zahlcení lze přidat archivaci/mazání starých řádků — zatím YAGNI.

### Přístup

- Hra zapisuje pomocí Supabase `anon` klíče (veřejný, v env vars).
- Dashboard čte stejným `anon` klíčem — Row Level Security není potřeba pro tuto fázi.
- Credentials v `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## Sync hook — `useSupabaseSync`

Soubor: `src/hooks/useSupabaseSync.ts`

Chování:
1. Při mount: načti nebo vygeneruj `childId` z localStorage.
2. Přihlás se k odběru změn Zustand store pomocí `useGameStore.subscribe`.
3. Po každé změně spusť 1minutový debounce timer (restart při další změně).
4. Po uplynutí: vyber serializovatelná pole z `GameState` a proveď `INSERT` do `child_snapshots`.
5. Funkce a React objekty (`particles`, callbacky) jsou z payloadu vynechány.

Serializovaná pole:
- `level`, `xp`, `combo`, `maxCombo`
- `diamonds`, `emeralds`, `stars`
- `totalCorrect`, `totalAttempts`, `sessionsPlayed`, `totalCorrectSession`
- `unlockedWorlds`, `ownedItems`, `showcaseSlots`
- `unlockedBadges`
- `studentProgress`
- `worldAccuracy`
- `muted`

Hook se volá jednou v `main.tsx` uvnitř herní větve (ne v `/parent` větvi).

---

## Routing

Soubor: `src/main.tsx`

Žádný React Router — jednoduchý pathname check:

```tsx
const isParent = window.location.pathname === '/parent'
root.render(isParent ? <ParentDashboard /> : <App />)
```

---

## ParentDashboard komponenta

Soubor: `src/components/screens/ParentDashboard.tsx`

Stavy:
1. **Vstup ID** — input pole + tlačítko "Načíst". ID se uloží do `localStorage` (`educraft-parent-child-id`) pro pohodlí.
2. **Načítání** — spinner.
3. **Data** — zobrazení posledního snapshotu: level/XP, přesnost, dovednosti, měna, odznaky, čas posledního syncu.
4. **Chyba / ID nenalezeno** — chybová hláška.

Dashboard fetchuje:
```sql
SELECT snapshot, synced_at
FROM child_snapshots
WHERE child_id = ?
ORDER BY synced_at DESC
LIMIT 1
```

Refresh: manuální tlačítko (žádný polling v první verzi).

---

## Nové soubory

| Soubor | Účel |
|--------|------|
| `src/lib/supabase.ts` | Inicializace Supabase klienta |
| `src/hooks/useSupabaseSync.ts` | Sync hook |
| `src/components/screens/ParentDashboard.tsx` | Dashboard UI |

## Změněné soubory

| Soubor | Změna |
|--------|-------|
| `src/main.tsx` | Pathname routing + volání `useSupabaseSync` |
| `.env` / `.env.example` | Přidány Supabase env vars |
| `package.json` | Přidána závislost `@supabase/supabase-js` |

## Beze změny

Vše ostatní — `gameStore.ts`, `App.tsx`, všechny herní komponenty, `config.ts`.
