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
  //{ id: 'crossbow',    name: 'Kuš',           icon: '/assets/items/icons/bow_bronze_arrow.png', category: 'weapon',   cost: { stars: 100 }, rarity: 'epic' },

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
  
  // Legendary Staves
  { id: 'staff_mystic', name: 'Mystická hůl', icon: '/assets/items/icons/staff_mystic.png', category: 'weapon', cost: { stars: 25, diamonds: 500 }, rarity: 'legendary' },
  { id: 'staff_fire',   name: 'Hůl věčného ohně', icon: '/assets/items/icons/staff_fire.png', category: 'weapon', cost: { stars: 15, diamonds: 300 }, rarity: 'epic' },
  { id: 'staff_water',  name: 'Hůl mrazivé vody', icon: '/assets/items/icons/staff_water.png', category: 'weapon', cost: { emeralds: 50, diamonds: 200 }, rarity: 'epic' },
  { id: 'staff_wind',   name: 'Hůl divokého větru', icon: '/assets/items/icons/staff_wind.png', category: 'weapon', cost: { emeralds: 50, diamonds: 200 }, rarity: 'epic' },

  // Legendary Items
  { id: 'elytra',       name: 'Vesmírná křídla', icon: '🌌', category: 'rare', cost: { stars: 50 }, rarity: 'legendary' },
  { id: 'totem',        name: 'Totem nesmrtelnosti', icon: '🗿', category: 'rare', cost: { stars: 40 }, rarity: 'legendary' },
  { id: 'netherite_crown', name: 'Netheritová koruna', icon: '👑', category: 'trophy', cost: { diamonds: 1000, emeralds: 20 }, rarity: 'legendary' },
  { id: 'diamond_cape',  name: 'Diamantová kápě', icon: '🧥', category: 'armor', cost: { diamonds: 400, emeralds: 10 }, rarity: 'epic' },

  // Shop-only legendary items (cannot be won from wheel/chest)
  { id: 'netherite_sword', name: 'Netheritový meč',  icon: '⚔️', category: 'weapon',     cost: { stars: 80, diamonds: 2000 },   rarity: 'legendary', shopOnly: true },
  { id: 'ender_pearl',    name: 'Ender perla',       icon: '🟣', category: 'rare',       cost: { stars: 60, diamonds: 1500 },   rarity: 'legendary', shopOnly: true },
  { id: 'beacon',         name: 'Beacon',            icon: '🔮', category: 'decoration', cost: { stars: 100 },                  rarity: 'legendary', shopOnly: true },
  { id: 'dragon_armor',   name: 'Dračí brnění',      icon: '🐉', category: 'armor',      cost: { stars: 70, emeralds: 1000 },   rarity: 'legendary', shopOnly: true },
  { id: 'nether_star',    name: 'Nether Star',       icon: '✨', category: 'rare',       cost: { stars: 120 },                  rarity: 'legendary', shopOnly: true },

  // New legendary shop-only items
  { id: 'wither_skull',     name: 'Wither lebka',        icon: '💀', category: 'weapon',     cost: { stars: 90, diamonds: 2000 },  rarity: 'legendary', shopOnly: true },
  { id: 'golden_apple',     name: 'Zlaté jablko',        icon: '🍎', category: 'rare',       cost: { stars: 65 },                  rarity: 'legendary', shopOnly: true },
  { id: 'enchanted_book',   name: 'Enchantovaná kniha',  icon: '📜', category: 'decoration', cost: { stars: 55, diamonds: 1200 },  rarity: 'legendary', shopOnly: true },
  { id: 'netherite_boots',  name: 'Netheritové boty',    icon: '🥾', category: 'armor',      cost: { stars: 75, diamonds: 1800 },  rarity: 'legendary', shopOnly: true },
  { id: 'obsidian_block',   name: 'Obsidiánový blok',    icon: '🖤', category: 'decoration', cost: { stars: 50, diamonds: 1000 },  rarity: 'legendary', shopOnly: true },
  { id: 'phoenix_feather',  name: 'Fénixové pero',       icon: '🪶', category: 'rare',       cost: { stars: 70 },                  rarity: 'legendary', shopOnly: true },
  { id: 'shadow_cloak',     name: 'Stínový plášť',       icon: '🌑', category: 'armor',      cost: { stars: 60, emeralds: 900 },   rarity: 'legendary', shopOnly: true },
  { id: 'storm_amulet',     name: 'Bouřkový amulet',     icon: '⚡', category: 'rare',       cost: { stars: 80, diamonds: 1500 },  rarity: 'legendary', shopOnly: true },
  { id: 'moon_orb',         name: 'Měsíční koule',       icon: '🌙', category: 'decoration', cost: { stars: 85 },                  rarity: 'legendary', shopOnly: true },
  { id: 'dragon_trophy',    name: 'Dračí trofej',        icon: '🐲', category: 'trophy',     cost: { stars: 110, diamonds: 2500 }, rarity: 'legendary', shopOnly: true },
]
