// src/components/screens/ShopScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { ShopItem, ItemCategory } from '../../data/types'
import { CURRENCY_ICONS } from '../../data/config'
import { Icon } from '../ui/Icon'
import { HUD } from '../hud/HUD'

const CATEGORIES: { id: ItemCategory | 'all'; label: string }[] = [
  { id: 'all',         label: '🎒 Vše'     },
  { id: 'weapon',      label: '⚔️ Zbraně'  },
  { id: 'armor',       label: '🛡️ Brnění'  },
  { id: 'trophy',      label: '🏆 Trofeje' },
  { id: 'decoration',  label: '✨ Deko'    },
  { id: 'rare',        label: '🌟 Vzácné'  },
]

function CostLabel({ item }: { item: ShopItem }) {
  const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
      {!!diamonds && <><Icon src={CURRENCY_ICONS.diamonds} size={14} />{diamonds}</>}
      {!!emeralds && <><Icon src={CURRENCY_ICONS.emeralds} size={14} />{emeralds}</>}
      {!!stars    && <><Icon src={CURRENCY_ICONS.stars}    size={14} />{stars}</>}
    </span>
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
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title" style={{ display: 'flex', gap: 16 }}>
        <span 
          style={{ cursor: 'pointer', opacity: mainTab === 'shop' ? 1 : 0.5, borderBottom: mainTab === 'shop' ? '2px solid var(--mc-gold)' : 'none', paddingBottom: 4 }}
          onClick={() => setMainTab('shop')}
        >🏪 Obchod</span>
        <span 
          style={{ cursor: 'pointer', opacity: mainTab === 'showcase' ? 1 : 0.5, borderBottom: mainTab === 'showcase' ? '2px solid var(--mc-gold)' : 'none', paddingBottom: 4 }}
          onClick={() => setMainTab('showcase')}
        >🖼️ Vitrína</span>
      </div>

      {mainTab === 'shop' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="shop-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`shop-tab ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="shop-grid" style={{ overflowY: 'auto', flex: 1 }}>
            <AnimatePresence>
              {visible.map((item, i) => {
                const isOwned = ownedItems.includes(item.id)
                const affordable = canAfford(item, diamonds, emeralds, stars)
                const isUrl = item.icon.startsWith('/') || item.icon.startsWith('http')
                return (
                  <motion.div
                    key={item.id}
                    className={[
                      'shop-item-card',
                      isOwned ? 'owned' : '',
                      !isOwned && !affordable ? 'locked' : '',
                      item.rarity === 'epic' ? 'epic' : '',
                      item.rarity === 'legendary' ? 'legendary' : '',
                    ].join(' ')}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleBuy(item)}
                  >
                    <span className="shop-item-icon" style={{ display: 'flex', justifyContent: 'center' }}>
                      {isUrl ? <img src={item.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : item.icon}
                    </span>
                    <div className="shop-item-name">{item.name}</div>
                    {isOwned
                      ? <div className="shop-item-owned">✓ mám</div>
                      : <div className="shop-item-price"><CostLabel item={item} /></div>
                    }
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {mainTab === 'showcase' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--mc-muted)', textAlign: 'center', marginBottom: 8 }}>
            {selectedSlot !== null ? `Vyber předmět pro slot ${selectedSlot + 1}` : 'Klikni na slot a pak na předmět'}
          </div>

          <div className="showcase-grid" style={{ marginBottom: 16 }}>
            {showcaseSlots.map((itemId, slot) => {
              const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
              const isUrl = item?.icon.startsWith('/') || item?.icon.startsWith('http')
              const isSelected = selectedSlot === slot
              return (
                <motion.div
                  key={slot}
                  className={`showcase-slot ${item ? 'filled' : 'empty'}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  style={{ outline: isSelected ? '2px solid var(--mc-gold)' : 'none', cursor: 'pointer' }}
                >
                  {item
                    ? (isUrl ? <img src={item.icon} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} /> : item.icon)
                    : '?'}
                </motion.div>
              )
            })}
          </div>

          <div style={{ fontSize: 12, color: 'var(--mc-muted)', marginBottom: 8, fontWeight: 700 }}>
            Moje předměty ({owned} z {total})
          </div>
          <div className="shop-grid">
            {SHOP_ITEMS.filter(i => ownedItems.includes(i.id)).map((item, idx) => {
              const isUrl = item.icon.startsWith('/') || item.icon.startsWith('http')
              const inShowcase = showcaseSlots.includes(item.id)
              return (
                <motion.div
                  key={item.id}
                  className={['shop-item-card', 'owned', item.rarity === 'epic' ? 'epic' : '', item.rarity === 'legendary' ? 'legendary' : ''].join(' ')}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    const slot = selectedSlot !== null ? selectedSlot : showcaseSlots.findIndex(s => s === null)
                    if (slot !== -1) { addToShowcase(item.id, slot); setSelectedSlot(null) }
                  }}
                  style={{ cursor: 'pointer', outline: inShowcase ? '2px solid var(--mc-gold)' : 'none' }}
                >
                  <span className="shop-item-icon" style={{ display: 'flex', justifyContent: 'center' }}>
                    {isUrl ? <img src={item.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : item.icon}
                  </span>
                  <div className="shop-item-name">{item.name}</div>
                  <div className="shop-item-owned">{inShowcase ? '⭐ ve vitríně' : '✓ mám'}</div>
                </motion.div>
              )
            })}
            {ownedItems.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--mc-muted)', padding: 24 }}>
                Zatím žádné předměty. Kup si je v Obchodě!
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigateTo('home')}>
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn active">
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('profile')}>
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
