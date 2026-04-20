// src/data/engWords.ts

export interface EngWord {
  english: string
  czech: string
  emoji: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'animals' | 'food' | 'nature' | 'objects' | 'colors'
}

export const ENG_WORDS: EngWord[] = [
  // Animals
  { english: 'dog',      czech: 'pes',       emoji: '🐶', difficulty: 'easy', category: 'animals' },
  { english: 'cat',      czech: 'kočka',     emoji: '🐱', difficulty: 'easy', category: 'animals' },
  { english: 'fish',     czech: 'ryba',      emoji: '🐟', difficulty: 'easy', category: 'animals' },
  { english: 'bird',     czech: 'pták',      emoji: '🐦', difficulty: 'easy', category: 'animals' },
  { english: 'cow',      czech: 'kráva',     emoji: '🐄', difficulty: 'easy', category: 'animals' },
  { english: 'pig',      czech: 'prase',     emoji: '🐷', difficulty: 'easy', category: 'animals' },
  { english: 'frog',     czech: 'žába',      emoji: '🐸', difficulty: 'easy', category: 'animals' },
  { english: 'bear',     czech: 'medvěd',    emoji: '🐻', difficulty: 'easy', category: 'animals' },
  { english: 'rabbit',   czech: 'králík',    emoji: '🐰', difficulty: 'easy', category: 'animals' },
  { english: 'duck',     czech: 'kachna',    emoji: '🦆', difficulty: 'easy', category: 'animals' },
  { english: 'horse',    czech: 'kůň',       emoji: '🐴', difficulty: 'easy', category: 'animals' },
  { english: 'snake',    czech: 'had',       emoji: '🐍', difficulty: 'easy', category: 'animals' },
  // Food
  { english: 'apple',    czech: 'jablko',    emoji: '🍎', difficulty: 'easy', category: 'food' },
  { english: 'banana',   czech: 'banán',     emoji: '🍌', difficulty: 'easy', category: 'food' },
  { english: 'bread',    czech: 'chleba',    emoji: '🍞', difficulty: 'easy', category: 'food' },
  { english: 'milk',     czech: 'mléko',     emoji: '🥛', difficulty: 'easy', category: 'food' },
  { english: 'egg',      czech: 'vejce',     emoji: '🥚', difficulty: 'easy', category: 'food' },
  { english: 'cake',     czech: 'dort',      emoji: '🎂', difficulty: 'easy', category: 'food' },
  { english: 'pizza',    czech: 'pizza',     emoji: '🍕', difficulty: 'easy', category: 'food' },
  // Nature
  { english: 'tree',     czech: 'strom',     emoji: '🌳', difficulty: 'easy', category: 'nature' },
  { english: 'flower',   czech: 'květ',      emoji: '🌸', difficulty: 'easy', category: 'nature' },
  { english: 'sun',      czech: 'slunce',    emoji: '☀️', difficulty: 'easy', category: 'nature' },
  { english: 'moon',     czech: 'měsíc',     emoji: '🌙', difficulty: 'easy', category: 'nature' },
  { english: 'star',     czech: 'hvězda',    emoji: '⭐', difficulty: 'easy', category: 'nature' },
  { english: 'fire',     czech: 'oheň',      emoji: '🔥', difficulty: 'easy', category: 'nature' },
  { english: 'water',    czech: 'voda',      emoji: '💧', difficulty: 'easy', category: 'nature' },
  { english: 'snow',     czech: 'sníh',      emoji: '❄️', difficulty: 'easy', category: 'nature' },
  { english: 'mountain', czech: 'hora',      emoji: '⛰️', difficulty: 'easy', category: 'nature' },
  // Objects
  { english: 'book',     czech: 'kniha',     emoji: '📖', difficulty: 'easy', category: 'objects' },
  { english: 'ball',     czech: 'míč',       emoji: '⚽', difficulty: 'easy', category: 'objects' },
  { english: 'house',    czech: 'dům',       emoji: '🏠', difficulty: 'easy', category: 'objects' },
  { english: 'car',      czech: 'auto',      emoji: '🚗', difficulty: 'easy', category: 'objects' },
  { english: 'key',      czech: 'klíč',      emoji: '🗝️', difficulty: 'easy', category: 'objects' },
  { english: 'hat',      czech: 'klobouk',   emoji: '🎩', difficulty: 'easy', category: 'objects' },
  { english: 'bag',      czech: 'taška',     emoji: '🎒', difficulty: 'easy', category: 'objects' },
]
