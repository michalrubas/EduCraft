// src/components/screens/ShopScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { ShopItem, ItemCategory } from '../../data/types'
import { HUD } from '../hud/HUD'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { theme, block, skyShort } from '../../theme'

const CATEGORIES: { id: ItemCategory | 'all'; label: string }[] = [
  { id: 'all',         label: '🎒 Vše'     },
  { id: 'weapon',      label: '⚔️ Zbraně'  },
  { id: 'armor',       label: '🛡️ Brnění'  },
  { id: 'trophy',      label: '🏆 Trofeje' },
  { id: 'decoration',  label: '✨ Deko'    },
  { id: 'rare',        label: '🌟 Vzácné'  },
]

function CostPill({ item }: { item: ShopItem }) {
  const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
  const parts: { icon: string; val: number }[] = []
  if (diamonds) parts.push({ icon: '💎', val: diamonds })
  if (emeralds) parts.push({ icon: '🟢', val: emeralds })
  if (stars) parts.push({ icon: '⭐', val: stars })
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center',
      background: theme.gold, borderRadius: 999, padding: '2px 8px',
      fontSize: 11, fontWeight: 900, color: theme.ink,
    }}>
      {parts.map((p, i) => <span key={i}>{p.icon}{p.val}</span>)}
    </div>
  )
}

function canAfford(item: ShopItem, diamonds: number, emeralds: number, stars: number): boolean {
  return (item.cost.diamonds ?? 0) <= diamonds &&
         (item.cost.emeralds ?? 0) <= emeralds &&
         (item.cost.stars    ?? 0) <= stars
}

export function ShopScreen() {
  const [mainTab, setMainTab] = useState<'shop' | 'showcase'>('shop')
  const [activeTab, setActiveTab] = useState<ItemCategory | 'all'>('all')
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const { diamonds, emeralds, stars, ownedItems, showcaseSlots, buyItem, addToShowcase, navigateTo } = useGameStore()

  const visible = activeTab === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === activeTab)

  function handleBuy(item: ShopItem) {
    if (ownedItems.includes(item.id)) return
    const ok = buyItem(item)
    if (ok) {
      const emptySlot = showcaseSlots.findIndex(s => s === null)
      if (emptySlot !== -1) addToShowcase(item.id, emptySlot)
    }
  }

  const owned = ownedItems.length
  const total = SHOP_ITEMS.length

  return (
    <ScreenShell background={skyShort}>
      <Cloud style={{ top: 80, left: 24, opacity: 0.7 }} />

      <HUD />

      {/* Main tabs: Obchod / Vitrína */}
      <div style={{ display: 'flex', gap: 10, padding: '6px 12px 10px', justifyContent: 'center' }}>
        {(['shop', 'showcase'] as const).map(tab => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMainTab(tab)}
            style={{
              background: theme.card,
              border: `3px solid ${theme.cardEdge}`,
              borderRadius: 14,
              padding: '8px 18px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: 14, fontWeight: 900, color: theme.ink,
              cursor: 'pointer',
              boxShadow: mainTab === tab ? block(4) : 'none',
              opacity: mainTab === tab ? 1 : 0.7,
            }}
          >
            {tab === 'shop' ? '🏪 Obchod' : '🖼️ Vitrína'}
          </motion.button>
        ))}
      </div>

      {mainTab === 'shop' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Category pills */}
          <div style={{
            display: 'flex', gap: 6, padding: '0 12px 8px',
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  flexShrink: 0, padding: '6px 12px',
                  borderRadius: 999,
                  background: activeTab === cat.id ? theme.gold : theme.card,
                  border: `2px solid ${activeTab === cat.id ? theme.goldDeep : theme.cardEdge}`,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 12, fontWeight: 900,
                  color: theme.ink, cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Item grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8, padding: '0 12px 12px',
            overflowY: 'auto', flex: 1,
          }}>
            <AnimatePresence>
              {visible.map((item, i) => {
                const isOwned = ownedItems.includes(item.id)
                const affordable = canAfford(item, diamonds, emeralds, stars)
                const isUrl = item.icon.startsWith('/') || item.icon.startsWith('http')
                const isEpic = item.rarity === 'epic'
                const isLegendary = item.rarity === 'legendary'
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleBuy(item)}
                    style={{
                      background: isLegendary
                        ? 'linear-gradient(180deg, #fff5d4, #ffe8a0)'
                        : theme.card,
                      border: `3px solid ${isEpic ? theme.purple : isLegendary ? theme.gold : theme.cardEdge}`,
                      borderRadius: 12,
                      padding: '10px 6px 8px',
                      textAlign: 'center',
                      cursor: isOwned ? 'default' : 'pointer',
                      position: 'relative',
                      opacity: !isOwned && !affordable ? 0.45 : 1,
                      boxShadow: block(3),
                    }}
                  >
                    {/* Owned badge */}
                    {isOwned && (
                      <div style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 22, height: 22, borderRadius: '50%',
                        background: theme.grass1, border: `2px solid ${theme.cardEdge}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, color: '#fff', fontWeight: 900,
                      }}>✓</div>
                    )}
                    <span style={{ fontSize: 30, display: 'block', marginBottom: 4 }}>
                      {isUrl ? <img src={item.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : item.icon}
                    </span>
                    <div style={{ fontSize: 11, fontWeight: 800, color: theme.inkSoft, marginBottom: 4 }}>{item.name}</div>
                    {!isOwned && <CostPill item={item} />}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {mainTab === 'showcase' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          <div style={{ fontSize: 11, color: theme.inkSoft, textAlign: 'center', marginBottom: 8, fontWeight: 800 }}>
            {selectedSlot !== null ? `Vyber předmět pro slot ${selectedSlot + 1}` : 'Klikni na slot a pak na předmět'}
          </div>

          {/* 4×2 showcase slots */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8, marginBottom: 16,
          }}>
            {showcaseSlots.map((itemId, slot) => {
              const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
              const isUrl = item?.icon.startsWith('/') || item?.icon.startsWith('http')
              const isSelected = selectedSlot === slot
              return (
                <motion.div
                  key={slot}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  style={{
                    aspectRatio: '1',
                    background: item ? theme.card : 'rgba(255,255,255,0.3)',
                    border: item
                      ? `3px solid ${theme.gold}`
                      : `2px dashed ${theme.cardEdge}`,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: item ? 26 : 16,
                    color: item ? theme.ink : theme.inkSoft,
                    cursor: 'pointer',
                    boxShadow: item ? block(3) : 'none',
                    outline: isSelected ? `3px solid ${theme.gold}` : 'none',
                    outlineOffset: 2,
                  }}
                >
                  {item
                    ? (isUrl ? <img src={item.icon} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} /> : item.icon)
                    : '?'}
                </motion.div>
              )
            })}
          </div>

          <div style={{ fontSize: 12, color: theme.inkSoft, marginBottom: 8, fontWeight: 800 }}>
            Moje předměty ({owned} z {total})
          </div>

          {/* Owned items grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {SHOP_ITEMS.filter(i => ownedItems.includes(i.id)).map((item, idx) => {
              const isUrl = item.icon.startsWith('/') || item.icon.startsWith('http')
              const inShowcase = showcaseSlots.includes(item.id)
              const isEpic = item.rarity === 'epic'
              const isLegendary = item.rarity === 'legendary'
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    if (inShowcase) return
                    const slot = selectedSlot !== null ? selectedSlot : showcaseSlots.findIndex(s => s === null)
                    if (slot !== -1) { addToShowcase(item.id, slot); setSelectedSlot(null) }
                  }}
                  style={{
                    background: isLegendary ? 'linear-gradient(180deg, #fff5d4, #ffe8a0)' : theme.card,
                    border: `3px solid ${inShowcase ? theme.gold : isEpic ? theme.purple : theme.cardEdge}`,
                    borderRadius: 12,
                    padding: '10px 6px 8px',
                    textAlign: 'center',
                    cursor: inShowcase ? 'default' : 'pointer',
                    boxShadow: block(3),
                  }}
                >
                  <span style={{ fontSize: 30, display: 'block', marginBottom: 4 }}>
                    {isUrl ? <img src={item.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : item.icon}
                  </span>
                  <div style={{ fontSize: 11, fontWeight: 800, color: theme.inkSoft, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: inShowcase ? theme.gold : theme.grass1 }}>
                    {inShowcase ? '⭐ ve vitríně' : '✓ mám'}
                  </div>
                </motion.div>
              )
            })}
            {ownedItems.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: theme.inkSoft, padding: 24, fontWeight: 800 }}>
                Zatím žádné předměty. Kup si je v Obchodě!
              </div>
            )}
          </div>
        </div>
      )}

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
          onClick={() => navigateTo('home')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.card, border: `3px solid ${theme.cardEdge}`,
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
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
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
