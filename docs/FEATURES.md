# EduCraft – Plán herních prvků (Gamifikační backlog)

> **Jak s tímto dokumentem pracovat:**
> Každou feature před implementací probereme – jestli dává smysl, není overkill a odpovídá věku 6–12 let.
> Ne vše musí být implementováno. Pořadí není závazné.
> Přidáváme postupně, začínáme s nejjednoduššími věcmi.

---

## Co už máme ✅

| Prvek | Kde | Poznámka |
|-------|-----|----------|
| **Bodový systém (měny)** | HUD, store | 💰 penízky / 💎 diamanty / ⬛ netherite |
| **Okamžitá zpětná vazba** | GameScreen | animace správně/špatně, zvuky, shake |
| **Kombo systém** | GameScreen, config | fire → doubleFire → mania; multiplikátor odměn |
| **Série + odměna (kolo štěstí)** | LuckyWheel | po 10 správných v řadě |
| **Truhla odměn** | MysteryChest | každých 15 správných v sezení |
| **Progrese světů** | worlds.ts | forest → cave → snow → nether → end; odemykání za 💰 |
| **Adaptivní obtížnost** | useAdaptiveDifficulty | rozsah čísel se přizpůsobuje výkonu |
| **Strom dovedností (ZPD)** | skills.ts | mastery 0–1, odemykání, ZPD výběr |
| **Obchod + sbírka** | ShopScreen | itemy, vitrína v profilu |
| **Příběh světa** | HomeScreen | krátký narativ na kartě světa |
| **Profil hráče** | ProfileScreen | statistiky, vitrína, progress dovedností |
| **Váhy typů úkolů** | worlds.ts | `{ type: 'math', weight: 3 }` |

---

## Backlog – k diskuzi a případné implementaci

### 🏅 ODZNAKY (Achievements / Badges)
**Co:** Hráč dostane vizuální odznak za konkrétní milník (první svět, 100 správných, 10× kombo, ...).
**Proč dává smysl:** Viditelné milníky jsou klíčové pro děti 6–12 let – potřebují cítit pokrok.
**Složitost:** Nízká – nová tabulka achievementů, jednoduchá kontrola podmínek po každé akci.
**Rizika:** Odznaky musí být dosažitelné, ne frustrující. Začít s 5–8 kusy, ne 50.
**Status:** 🔲 K diskuzi

---

### 📋 QUESTY / DENNÍ VÝZVY
**Co:** „Dnes: splň 5 příkladů násobení" nebo „Dokončit jeskyni bez chyby". Krátká mise s extra odměnou.
**Proč dává smysl:** Strukturuje session do konkrétního cíle, drží dítě ve flow, vytváří důvod vrátit se.
**Složitost:** Střední – potřeba systém na definici questů, sledování podmínek, reset po dni/sezení.
**Rizika:** Questy nesmí být povinné (autonomie). Spíše jako bonus cíl, ne blokátor.
**Status:** 🔲 K diskuzi

---

### 📈 ÚROVNĚ HRÁČE (XP + Level)
**Co:** Hráč sbírá XP (= přepočtené správné odpovědi) a postupuje na vyšší level (1 → 2 → ... → 20).
**Proč dává smysl:** Jasný ukazatel celkového pokroku přes všechny světy. Děti milují číslo, které roste.
**Složitost:** Nízká – XP counter, level tabulka, vizuál v HUD nebo profilu.
**Rizika:** Duplikuje trochu kombo/měny. Musí být jasné, co level přináší (kosmetika? odemykání?).
**Status:** 🔲 K diskuzi

---

### 🔄 OPAKOVÁNÍ (Spaced Repetition / Review mód)
**Co:** Po X dnech hra připomene dovednost, která začíná klesat (mastery decay over time). „Nezapomněls 7×8?"
**Proč dává smysl:** Vědecky nejsilnější mechanismus pro dlouhodobé zapamatování. Logické rozšíření existujícího mastery systému.
**Složitost:** Střední – potřeba timestamp poslední odpovědi per skill, decay funkce, "review prompt" na homescreen.
**Rizika:** Může působit jako povinnost. Spíše jako jemná připomínka, ne blokátor hraní.
**Status:** 🔲 K diskuzi

---

### 🎯 VÝBĚR OBTÍŽNOSTI (Autonomie hráče)
**Co:** Před vstupem do světa hráč zvolí „Lehký / Střední / Těžký" – ovlivní numberRange nebo tempo skill progression.
**Proč dává smysl:** Autonomie = vnitřní motivace (SDT). Dítě se cítí zodpovědné za vlastní učení.
**Složitost:** Nízká – přidat UI dialog, předat override do useAdaptiveDifficulty.
**Rizika:** Děti si vždy vyberou nejlehčí. Buď skrýt za učitelský panel, nebo gamifikovat (těžší = vyšší odměny).
**Status:** 🔲 K diskuzi

---

### 👨‍👩‍👧 RODIČOVSKÝ / UČITELSKÝ PANEL
**Co:** Obrazovka (nebo export) kde rodič/učitel vidí: čas strávený hraním, které dovednosti se zlepšily, kde dítě chybuje, trend za týden.
**Proč dává smysl:** Bez zpětné vazby pro dospělého je vzdělávací hodnota aplikace neviditelná.
**Složitost:** Střední–vysoká – nová obrazovka, grafy, případně export do PDF/CSV.
**Rizika:** Nesmí být strašák – data jsou pro podporu, ne hodnocení.
**Status:** 🔲 K diskuzi

---

### 🌟 SPECIÁLNÍ EVENTY / SEZÓNNÍ OBSAH
**Co:** „Vánoční svět" s extra úkoly a omezenou odměnou (např. jen v prosinci). Nebo týdenní výzva.
**Proč dává smysl:** Důvod vrátit se. Pocit výjimečnosti a časové omezenosti motivuje.
**Složitost:** Nízká–střední – flag v config pro aktivní event, speciální biome nebo task pool.
**Rizika:** Nesmí frustrovat děti, které to zmeškají. Obsah musí být recyklovatelný.
**Status:** 🔲 K diskuzi

---

### 🤝 KOOPERATIVNÍ PRVKY (Třída / Tým)
**Co:** Společný cíl třídy – „Třída 3B dnes správně odpověděla 500×". Sdílená odměna pro všechny.
**Proč dává smysl:** Snižuje destruktivní soutěž, buduje sounáležitost, vhodné pro školní prostředí.
**Složitost:** Vysoká – vyžaduje backend, synchronizaci mezi zařízeními, autentizaci.
**Rizika:** Technicky náročné. Pro MVP overkill.
**Status:** 🔲 K diskuzi (spíše do budoucna)

---

### 🏆 ŽEBŘÍČEK (Leaderboard)
**Co:** Hráči vidí pořadí podle počtu správných odpovědí nebo nasbíraných XP.
**Proč dává smysl:** Motivuje soutěživé děti, ale pozor – může demotivovat slabší hráče.
**Složitost:** Střední (lokální) / Vysoká (online mezi zařízeními).
**Rizika:** Výzkumy varují – žebříčky posilují motivaci u silnějších, ale snižují u slabších žáků. Pokud, tak anonymizovaný nebo jen v rámci třídy s učitelovým moderováním.
**Status:** 🔲 K diskuzi (nízká priorita)

---

### 💬 NARRAČNÍ LINKA / PŘÍBĚHOVÝ OBLOUK
**Co:** Propojená příběhová linka přes celou hru – hrdina má jméno, biome mají návazný příběh, questy jsou součástí vyprávění.
**Proč dává smysl:** Narativ zvyšuje engagement a dává smysl jednotlivým úkolům. Děti si lépe zapamatují kontext.
**Složitost:** Nízká (textová), střední (s ilustracemi/animacemi).
**Rizika:** Texto příliš dlouhý = děti přeskočí. Stačí 1–2 věty per milestone.
**Status:** 🔲 K diskuzi (zárodek už máme v `story` poli každého světa)

---

### 🎨 PERSONALIZACE AVATARA
**Co:** Hráč si zvolí jméno a vzhled postavy (Minecraft skin styl). Postava se zobrazuje v profilu.
**Proč dává smysl:** Pocit vlastnictví a identity. Děti rády „mají svoji postavu".
**Složitost:** Střední – UI pro výběr, uložení do store.
**Rizika:** Bez serveru je personalizace jen lokální (sdílené zařízení = sdílená postava).
**Status:** 🔲 K diskuzi

---

## Prioritizační matice

| Feature | Vzdělávací hodnota | Implementační náročnost | Vhodnost pro 6–12 let | Doporučení |
|---------|-------------------|------------------------|----------------------|-----------|
| Odznaky | ⭐⭐⭐ | 🟢 nízká | ✅ vysoká | **Začít zde** |
| Denní questy | ⭐⭐⭐ | 🟡 střední | ✅ vysoká | **Druhý krok** |
| XP + Level | ⭐⭐ | 🟢 nízká | ✅ vysoká | **Druhý krok** |
| Výběr obtížnosti | ⭐⭐⭐ | 🟢 nízká | ✅ vysoká | **Brzy** |
| Spaced repetition | ⭐⭐⭐⭐ | 🟡 střední | ⚠️ střední | Až bude základ stabilní |
| Rodičovský panel | ⭐⭐⭐⭐ | 🔴 vysoká | ✅ (pro rodiče) | Pozdější fáze |
| Sezónní eventy | ⭐⭐ | 🟡 střední | ✅ vysoká | Volitelné |
| Narační linka | ⭐⭐ | 🟢 nízká | ✅ vysoká | Kdykoli |
| Avatar | ⭐ | 🟡 střední | ✅ vysoká | Kosmetika, nízká priorita |
| Předměty s efekty | ⭐⭐⭐ | 🟡 střední | ✅ vysoká | **V plánu** |
| Kooperace/třída | ⭐⭐⭐ | 🔴 velmi vysoká | ✅ vysoká | Až bude backend |
| Žebříček | ⭐ | 🔴 vysoká | ⚠️ rizikové | Zvážit opatrně |

---

## 🛠️ Rozpracované nápady (Backlog)

### 🎒 Pasivní Bonusy z Předmětů (Artifacts)
- **Mechanika:** 3 předměty umístěné ve Vitríně (Profile Showcase) dávají aktivní bonusy.
- **Zbraně (XP Boost):** +XP body, urychlení levelování.
- **Zbroje (Combo Shield):** Šance na záchranu komba při chybě.
- **Magie/Dekorace (Economy):** Více zlaťáků, častější truhly.
- **Legendární (Luck):** Vylepšené Kolo štěstí.

### 🍱 Assety a Resource Packy
Všechny nové Minecraft obrázky (PNG) nahrávat do složky:
- `/public/assets/items/` (meče, jídlo, předměty)
- `/public/assets/blocks/` (bloky pro biomy)
- `/public/assets/ui/` (ikony srdíček, pozadí)

---

## Poznámky k věkové skupině 6–12 let

- **Kratší session** – úkoly a odměny musí přicházet rychle; nezatěžovat příliš dlouhými questy
- **Viditelný pokrok** – progress bary, odznaky a levely jsou důležitější než abstraktní skóre
- **Bezpečné selhání** – chyba nesmí trestat, jen dávat šanci opakovat
- **Žádné žebříčky bez moderování** – soutěž mezi spolužáky může demotivovat slabší
- **Jednoduché mechaniky** – max 2–3 aktivní herní systémy najednou (kombo + odznaky + level = OK, víc = chaos)
- **Kooperace > soutěž** – sdílené cíle třídy nebo rodinné výzvy fungují lépe než individuální žebříček
