import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FacilityScene from '../three/FacilityScene';
import { MicroscopeIcon, TargetIcon, LeafIcon } from '../components/Icons';

const quickStats = [
  { value: '3', label: 'Core Functional Zones' },
  { value: '500 Ci', label: 'Mo-99 Annual Output' },
  { value: '~300K', label: 'Annual Visitors (Est.)' },
  { value: '500K t', label: 'Annual CO₂ Reduction' },
];

const zoneCards = [
  {
    to: '/medicine', Icon: MicroscopeIcon,
    iconColor: 'text-blue-600', titleHover: 'group-hover:text-blue-600', tagClass: 'bg-blue-100 text-blue-600',
    title: 'Medical Isotope Production Center',
    desc: 'Mo-99, Lu-177, and I-131 produced via Linglong-One neutron irradiation — ending Southeast Asia\'s reliance on trans-oceanic nuclear medicine supply chains.',
    tags: ['Mo-99', 'Lu-177', 'I-131'],
  },
  {
    to: '/science', Icon: TargetIcon,
    iconColor: 'text-green-600', titleHover: 'group-hover:text-green-600', tagClass: 'bg-green-100 text-green-600',
    title: 'Immersive Nuclear Science Park',
    desc: 'Transparent reactor data wall, radiation blind-box lab, VR Linglong-One journey — making nuclear safety visible, tangible, and trusted by everyone.',
    tags: ['Transparency', 'Blind Box', 'VR Tour'],
  },
  {
    to: '/agriculture', Icon: LeafIcon,
    iconColor: 'text-emerald-600', titleHover: 'group-hover:text-emerald-600', tagClass: 'bg-emerald-100 text-emerald-600',
    title: 'Zero-Carbon Circular Agriculture',
    desc: 'SMR warm discharge water enables off-season tropical fruit and high-value aquaculture — turning nuclear energy from a "neighbor" into the local farmer\'s "partner".',
    tags: ['Greenhouse', 'Aquaculture', 'Carbon Calc'],
  },
] as const;

// Simple X icon for close button
function XIcon({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className ?? ''}`} style={{ width: '1.2em', height: '1.2em' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </span>
  );
}

export default function HomePage() {
  const [focusedBuilding, setFocusedBuilding] = useState<{ id: string; name: string; description: string } | null>(null);

  const handleExitInterior = useCallback(() => setFocusedBuilding(null), []);

  useEffect(() => {
    const container = document.getElementById('scene-container');
    if (!container) return;

    function onBuildingClick(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setFocusedBuilding({ id: detail.id, name: detail.name, description: detail.description });
      }
    }

    container.addEventListener('building-click', onBuildingClick);
    return () => container.removeEventListener('building-click', onBuildingClick);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero — Full viewport 3D scene */}
      <div id="scene-container" className="relative h-screen w-full overflow-hidden">
        <FacilityScene focusedBuildingId={focusedBuilding?.id ?? null} onExitInterior={handleExitInterior} />

        {/* Overlay content — hidden when viewing interior */}
        {!focusedBuilding && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="pointer-events-auto text-center px-8 py-6 rounded-2xl bg-black/15 backdrop-blur-sm">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3">
                <span className="gradient-text">Silk Road Nuclear Light</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-2">Belt &amp; Road Nuclear Light Complex</p>
              <p className="text-sm md:text-base text-white/75 max-w-xl mx-auto">
                World's First Linglong-One SMR &middot; Hainan Changjiang &middot; Gateway to Southeast Asia
              </p>
              <p className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-sm font-semibold backdrop-blur-sm">
                🏆 Best Project — HackAtom 2026 English Division
              </p>
              <div className="flex gap-4 mt-6 justify-center">
                <Link to="/about" className="px-6 py-3 bg-white/70 hover:bg-white/90 border border-white/30 rounded-full text-sm transition-colors text-slate-800 font-medium">
                  Learn More
                </Link>
                <a href="#overview" className="px-6 py-3 bg-blue-500/90 hover:bg-blue-500 rounded-full text-sm transition-colors text-white font-medium">
                  Explore Zones
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Exit interior button */}
        {focusedBuilding && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="pointer-events-auto glass rounded-full px-5 py-2.5 flex items-center gap-3 shadow-lg">
              <span className="text-sm font-medium text-slate-700">{focusedBuilding.name}</span>
              <button onClick={handleExitInterior}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1 transition-colors">
                <XIcon /> Back to Panorama
              </button>
            </div>
          </div>
        )}

        {/* Building info when focused */}
        {focusedBuilding && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="pointer-events-auto glass rounded-xl px-5 py-3 text-sm text-slate-600 max-w-md text-center shadow-lg">
              {focusedBuilding.description}
            </div>
          </div>
        )}

        {/* Scroll hint — hidden when focused */}
        {!focusedBuilding && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs animate-bounce z-10 pointer-events-none drop-shadow">
            &darr; Scroll to explore &middot; Click buildings to enter
          </div>
        )}
      </div>

      {/* Overview section */}
      <section id="overview" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800">Three Zones &middot; One Digital Twin</h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16">
          Powered by the Linglong-One SMR at the center of the 3D model above, three functional systems — medical isotope production,
          nuclear science education, and green circular agriculture — form an international demonstration complex that makes
          nuclear energy visible, tangible, and trusted.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {zoneCards.map(({ to, Icon, iconColor, titleHover, tagClass, title, desc, tags }) => (
            <Link key={to} to={to} className="group glass rounded-2xl p-6 hover:bg-white/90 transition-colors hover:shadow-md">
              <div className={`${iconColor} mb-3`}><Icon className="text-3xl" /></div>
              <h3 className={`text-lg font-semibold mb-2 ${titleHover} transition-colors text-slate-800`}>{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              <div className="flex gap-2 mt-4">
                {tags.map(tag => (
                  <span key={tag} className={`text-xs ${tagClass} px-2 py-0.5 rounded`}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {quickStats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
