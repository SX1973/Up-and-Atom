export interface RadiationItem {
  id: number; name: string; value: number; icon: string; fact: string; category: 'daily' | 'medical' | 'nuclear' | 'nature';
}

export const radiationItems: RadiationItem[] = [
  { id: 1,  name: 'Banana (1 piece)',         value: 0.1,    icon: '🍌', category: 'daily',   fact: 'Contains natural K-40 — eating one banana gives ~0.1 μSv' },
  { id: 2,  name: 'Brazil nuts (handful)',     value: 0.2,    icon: '🥜', category: 'daily',   fact: 'Contains Ra-226 — among the most radioactive natural foods' },
  { id: 3,  name: 'Luminous wristwatch',       value: 0.02,   icon: '⌚', category: 'daily',   fact: 'Tritium-powered glow — wearing for a year ≈ eating 2 bananas' },
  { id: 4,  name: 'Granite kitchen countertop', value: 0.3,   icon: '🪨', category: 'nature',  fact: 'Trace uranium & thorium — a major natural indoor radiation source' },
  { id: 5,  name: 'Airport security scanner',  value: 0.0002, icon: '🛄', category: 'daily',   fact: 'X-ray backscatter — single dose far lower than high-altitude flight' },
  { id: 6,  name: 'NPP site boundary',          value: 0.08,   icon: '🏭', category: 'nuclear', fact: 'Lower than the daily fluctuation of natural background in most cities' },
  { id: 7,  name: 'High-altitude flight (1 h)', value: 5.0,    icon: '✈️', category: 'nature',  fact: 'Cosmic rays increase with altitude — Beijing→Sanya ≈ 10 μSv one way' },
  { id: 8,  name: 'Brazilian black-sand beach', value: 2.0,    icon: '🏖️', category: 'nature',  fact: 'Monazite sand rich in thorium — a beach day ≈ 5 chest X-rays' },
  { id: 9,  name: 'Smoke detector (Am-241)',    value: 0.001,  icon: '🔊', category: 'daily',   fact: 'Ionization detectors containing Am-241 — safely used by billions worldwide' },
  { id: 10, name: 'Post-Fukushima Pacific seawater', value: 0.0001, icon: '🌊', category: 'nuclear', fact: '10 years after the accident, below instrumental detection limits' },
  { id: 11, name: 'Chest CT (single scan)',     value: 7000,   icon: '🏥', category: 'medical', fact: 'One chest CT ≈ standing at an NPP site boundary for 10 years' },
  { id: 12, name: 'Whole-body PET-CT (single)', value: 25000,  icon: '🩻', category: 'medical', fact: 'Used for precise cancer diagnosis — benefits far outweigh radiation risks' },
];

let lastPairIds: [number, number] = [0, 0];

export function pickChallengePair(): [RadiationItem, RadiationItem] {
  const items = radiationItems.filter(i => i.value < 100);
  const i1 = items[Math.floor(Math.random() * items.length)];
  let i2 = items[Math.floor(Math.random() * items.length)];
  // Avoid same item and same pair as last round
  while (i2.id === i1.id || (i1.id === lastPairIds[0] && i2.id === lastPairIds[1]) || (i1.id === lastPairIds[1] && i2.id === lastPairIds[0])) {
    i2 = items[Math.floor(Math.random() * items.length)];
  }
  lastPairIds = [i1.id, i2.id];
  return [i1, i2];
}
