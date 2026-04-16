// src/data/worlds.ts
import { World } from './types'

export const WORLDS: World[] = [
  {
    id: 'forest',
    name: 'Příroda',
    icon: '🌿',
    blockColor: '#4a7c2f',   // grass block green
    biome: 'forest',
    taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice',{type: 'math', weight: 5}],
    numberRange: [1, 10],
    unlockCost: 0,
    comboMultiplier: 1.0,
    bgColor: '#0d2010',
    accentColor: '#5dfc8c',
    story: 'Zachraň vesnici od hladu! Spočítej zásoby a pomoz farmářům.',
  },
  {
    id: 'cave',
    name: 'Jeskyně',
    icon: '⛏️',
    blockColor: '#5a5a5a',   // stone block grey
    biome: 'cave',
    taskTypes: ['counting',{type: 'math', weight: 5},{type:'mathMultiply', weight:5}, 'multiChoice', 'dragDrop'],
    numberRange: [5, 20],
    unlockCost: 30,
    comboMultiplier: 1.5,
    bgColor: '#1a0d00',
    accentColor: '#ff9f43',
    story: 'Prozkoumej temnou jeskyni a najdi poklady! Pozor na příšery.',
  },
  {
    id: 'snow',
    name: 'Sněžné',
    icon: '🧊',
    blockColor: '#6aadcc',   // packed ice blue
    biome: 'snow',
    taskTypes: ['find', 'compare', 'dragDrop',{type: 'math', weight: 5}],
    numberRange: [10, 50],
    unlockCost: 60,
    comboMultiplier: 1.75,
    bgColor: '#0a1520',
    accentColor: '#74b9ff',
    story: 'Přežij sněžnou bouři! Postav igloo a nakorm tučňáky.',
  },
  {
    id: 'nether',
    name: 'Nether',
    icon: '🔥',
    blockColor: '#7a1b1b',   // netherrack dark red
    biome: 'nether',
    taskTypes: ['math', 'find', 'dragDrop',{type: 'math', weight: 5}],
    numberRange: [20, 100],
    unlockCost: 150,
    comboMultiplier: 2.0,
    bgColor: '#200005',
    accentColor: '#ff6b6b',
    story: 'Vstup do Netheru a znič mocného draka! Jen nejchytřejší přežijí.',
  },
    {
    id: 'end',
    name: 'End',
    icon: '☢️',
    blockColor: '#6e936e', 
    biome: 'end',
    taskTypes: ['math', 'find', 'dragDrop',{type: 'math', weight: 5}],
    numberRange: [50, 150],
    unlockCost: 300,
    comboMultiplier: 3.0,
    bgColor: '#200005',
    accentColor: '#607f81',
    story: 'Vstup do Endu a znič mocného Ender draka! Jen nejchytřejší přežijí.',
  },
]

export function getWorld(id: string): World | undefined {
  return WORLDS.find(w => w.id === id)
}
