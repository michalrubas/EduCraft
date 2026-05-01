# Design: 10 nových legendary shopOnly předmětů

**Datum:** 2026-05-01  
**Status:** Schváleno

---

## Kontext

Přidáme 10 nových předmětů do obchodu (`src/data/shopItems.ts`). Všechny jsou:
- `rarity: 'legendary'`
- `shopOnly: true` — nelze vyhrát z kola štěstí ani truhly
- Ceny kalibrované vůči stávajícím legendary shopOnly předmětům (rozsah stars 50–130)

Žádné změny typů, schématu ani migrace nejsou potřeba — `ShopItem` interface i `shopOnly` flag jsou v projektu přítomny.

---

## Předměty

### Minecraft-ikonické

| id | Název | Ikona | Kategorie | Cena |
|---|---|---|---|---|
| `wither_skull` | Wither lebka | 💀 | weapon | stars: 90, diamonds: 2000 |
| `golden_apple` | Zlaté jablko | 🍎 | rare | stars: 65 |
| `enchanted_book` | Enchantovaná kniha | 📜 | decoration | stars: 55, diamonds: 1200 |
| `netherite_boots` | Netheritové boty | 🥾 | armor | stars: 75, diamonds: 1800 |
| `obsidian_block` | Obsidiánový blok | 🖤 | decoration | stars: 50, diamonds: 1000 |

### Fantasy-originální

| id | Název | Ikona | Kategorie | Cena |
|---|---|---|---|---|
| `phoenix_feather` | Fénixové pero | 🪶 | rare | stars: 70 |
| `shadow_cloak` | Stínový plášť | 🌑 | armor | stars: 60, emeralds: 900 |
| `storm_amulet` | Bouřkový amulet | ⚡ | rare | stars: 80, diamonds: 1500 |
| `moon_orb` | Měsíční koule | 🌙 | decoration | stars: 85 |
| `dragon_trophy` | Dračí trofej | 🐲 | trophy | stars: 110, diamonds: 2500 |

---

## Implementace

Jediný soubor ke změně: `src/data/shopItems.ts` — přidat 10 záznamů do pole `SHOP_ITEMS`.
