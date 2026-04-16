// src/data/shopItems.ts
import { ShopItem } from './types'

export const SHOP_ITEMS: ShopItem[] = [
  // Weapons
  { id: 'sword_wood',  name: 'Dřevěný meč',  icon: '🗡️', category: 'weapon', cost: { diamonds: 0  }, rarity: 'common'    },
  { id: 'sword_stone', name: 'Kamenný meč',   icon: '⚔️', category: 'weapon', cost: { diamonds: 20 }, rarity: 'common'    },
  { id: 'axe',         name: 'Sekera',         icon: '🪓', category: 'weapon', cost: { diamonds: 25 }, rarity: 'common'    },
  { id: 'bow',         name: 'Luk',            icon: '🏹', category: 'weapon', cost: { emeralds: 15 }, rarity: 'rare'      },
  { id: 'trident',     name: 'Trojzubec',      icon: '🔱', category: 'weapon', cost: { diamonds: 60 }, rarity: 'epic'      },
  { id: 'scary_face',  name: 'Scary Face',    icon: '🫥', category: 'weapon',   cost: { stars: 30, diamonds: 500 }, rarity: 'legendary' }, 
  { id: 'crossbow',    name: 'Kuš',           icon: '/assets/items/icons/bow_bronze_arrow.png', category: 'weapon',   cost: { stars: 100 }, rarity: 'epic' },

  // Armor
  { id: 'shield',      name: 'Štít',           icon: '🛡️', category: 'armor',  cost: { diamonds: 35 }, rarity: 'common'    },
  { id: 'helmet',      name: 'Přilba',         icon: '⛑️', category: 'armor',  cost: { diamonds: 40 }, rarity: 'rare'      },
  // Trophies
  { id: 'trophy',      name: 'Trofej',         icon: '🏆', category: 'trophy', cost: { diamonds: 30 }, rarity: 'rare'      },
  { id: 'medal',       name: 'Medaile',        icon: '🥇', category: 'trophy', cost: { emeralds: 20 }, rarity: 'rare'      },
  { id: 'crown',       name: 'Koruna',         icon: '👑', category: 'trophy', cost: { diamonds: 80 }, rarity: 'epic'      },
  // Decorations
  { id: 'potion',      name: 'Lektvar',        icon: '🧪', category: 'decoration', cost: { emeralds: 8  }, rarity: 'common' },
  { id: 'book',        name: 'Kouzelná kniha', icon: '📖', category: 'decoration', cost: { emeralds: 12 }, rarity: 'common' },
  { id: 'diamond_gem', name: 'Diamant',        icon: '💎', category: 'decoration', cost: { diamonds: 50 }, rarity: 'rare'   },
  // Rare
  { id: 'star_item',   name: 'Hvězda',         icon: '🌟', category: 'rare',   cost: { stars: 10 },     rarity: 'legendary' },
  { id: 'dragon_egg',  name: 'Dračí vejce',    icon: '🥚', category: 'rare',   cost: { stars: 15 },     rarity: 'legendary' },
  //Potion
  { id: 'red_potion',  name: 'Červený lektvar',     icon: '/assets/items/potions/pt1.png', category: 'rare',   cost: { diamonds: 50 },  rarity: 'rare' },
  { id: 'blue_potion',  name: 'Modrý lektvar',      icon: '/assets/items/potions/pt2.png', category: 'rare',   cost: { diamonds: 100 },  rarity: 'rare' },
  { id: 'green_potion',  name: 'Zelený lektvar',    icon: '/assets/items/potions/pt3.png', category: 'rare',   cost: { diamonds: 150 },  rarity: 'rare' },
  { id: 'yellow_potion',  name: 'Žlutý lektvar',    icon: '/assets/items/potions/pt4.png', category: 'rare',   cost: { diamonds: 200 },  rarity: 'rare' },
]
