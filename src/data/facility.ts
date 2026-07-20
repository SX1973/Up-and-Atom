export interface BuildingData {
  id: string; name: string; zone: 'A' | 'B' | 'C' | 'core';
  position: [number, number, number]; size: [number, number, number];
  color: string; shape: 'cylinder' | 'box' | 'dome' | 'hyperboloid' | 'greenhouse';
  description: string;
}

export const facilityBuildings: BuildingData[] = [
  { id: 'reactor',    name: 'Linglong-One ACP100 Reactor',  zone: 'core', position: [0, 0, 0],     size: [3, 6, 3],   color: '#94a3b8', shape: 'dome',         description: 'The world\'s first land-based commercial SMR — integrated PWR, 125 MWe, operational by 2026.' },
  { id: 'turbine',    name: 'Turbine Generator Hall',       zone: 'core', position: [6, 0, 0],     size: [8, 3, 3],   color: '#64748b', shape: 'box',          description: 'Converts steam thermal energy into electricity for the Hainan grid and on-site facilities.' },
  { id: 'medicine',   name: 'Medical Isotope Center',        zone: 'A',    position: [-5, 0, 4],    size: [5, 2.5, 3], color: '#3b82f6', shape: 'box',          description: 'Neutron irradiation produces Mo-99, Lu-177, I-131 and other medical isotopes for the Southeast Asian market.' },
  { id: 'hotcell',    name: 'Hot Cell Separation Facility',  zone: 'A',    position: [-5, 0, 8],    size: [4, 2, 2.5], color: '#2563eb', shape: 'box',          description: '1.5 m heavy concrete shielding with remote manipulators for radiochemical separation and purification.' },
  { id: 'science',    name: 'Nuclear Science Discovery Center', zone: 'B', position: [4, 0, -7],    size: [6, 3, 5],   color: '#10b981', shape: 'box',          description: 'Transparent data wall, radiation blind-box lab, and VR immersion zone — ~300,000 visitors annually.' },
  { id: 'exhibit',    name: 'Public Exhibition Plaza',       zone: 'B',    position: [8, 0, -7],    size: [4, 0.5, 4], color: '#34d399', shape: 'box',          description: 'Open-air science exhibition area hosting public open days and youth study programs.' },
  { id: 'greenhouse1',name: 'Tropical Fruit Greenhouse',     zone: 'C',    position: [-3, 0, -8],   size: [4, 1.5, 3], color: '#86efac', shape: 'greenhouse',   description: 'Warm discharge water heats greenhouses for off-season dragon fruit and durian seedling cultivation.' },
  { id: 'greenhouse2',name: 'Warm-Water Aquaculture Base',   zone: 'C',    position: [2, 0, -8],    size: [3, 1.2, 3], color: '#6ee7b7', shape: 'greenhouse',   description: 'Warm-water aquaculture of leopard coral grouper and pearl gentian grouper — growth cycle shortened by 15–20%.' },
  { id: 'cooling1',   name: 'Cooling Tower #1',             zone: 'core', position: [-5, 0, -3],   size: [2, 5, 2],   color: '#cbd5e1', shape: 'hyperboloid',  description: 'Natural-draft cooling tower dissipating secondary-loop waste heat to the atmosphere.' },
  { id: 'cooling2',   name: 'Cooling Tower #2',             zone: 'core', position: [-8, 0, -3],   size: [2, 5, 2],   color: '#cbd5e1', shape: 'hyperboloid',  description: 'Dual-tower design ensures ultimate heat-sink redundancy under all operating conditions.' },
  { id: 'admin',      name: 'Administration Building',       zone: 'core', position: [10, 0, 2],    size: [3, 2, 2],   color: '#475569', shape: 'box',          description: 'Complex headquarters, international cooperation office, and visitor reception area.' },
];
