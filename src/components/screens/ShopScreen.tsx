// src/components/screens/ShopScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { ShopItem, ItemCategory } from '../../data/types'
import { HUD } from '../hud/HUD'

const CATEGORIES: { id: ItemCategory | 'all'; label: string }[] = [
  { id: 'all',         label: '🎒 Vše'     },
  { id: 'weapon',      label: '⚔️ Zbraně'  },
  { id: 'armor',       label: '🛡️ Brnění'  },
  { id: 'trophy',      label: '🏆 Trofeje' },
  { id: 'decoration',  label: '✨ Deko'    },
  { id: 'rare',        label: '🌟 Vzácné'  },
]

function costLabel(item: ShopItem): string {
  const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
  const parts: string[] = []
  if (diamonds) parts.push(`💰 ${diamonds}`)
  if (emeralds) parts.push(`💎 ${emeralds}`)
  if (stars)    parts.push(`⬛ ${stars}`)
  return parts.join(' ')
}

function canAfford(item: ShopItem, diamonds: number, emeralds: number, stars: number): boolean {
  return (item.cost.diamonds ?? 0) <= diamonds &&
         (item.cost.emeralds ?? 0) <= emeralds &&
         (item.cost.stars    ?? 0) <= stars
}

export function ShopScreen() {
  const [activeTab, setActiveTab] = useState<ItemCategory | 'all'>('all')
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
      <div className="section-title">🏪 Obchod</div>

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
                <span className="shop-item-icon">{item.icon}</span>
                <div className="shop-item-name">{item.name}</div>
                {isOwned
                  ? <div className="shop-item-owned">✓ mám</div>
                  : <div className="shop-item-price">{costLabel(item)}</div>
                }
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="section-title">🖼️ Vitrína</div>
      <div className="showcase-grid">
        {showcaseSlots.map((itemId, slot) => {
          const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
          return (
            <motion.div
              key={slot}
              className={`showcase-slot ${item ? 'filled' : 'empty'}`}
              whileTap={{ scale: 0.9 }}
            >
              {item ? item.icon : '?'}
            </motion.div>
          )
        })}
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(owned / total) * 100}%` }} />
        </div>
        <div className="progress-bar-label">{owned} z {total} předmětů</div>
      </div>

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
