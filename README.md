# Silk Road Nuclear Light · 丝路核光

**HackAtom 2026 — Hainan Changjiang International SMR Complex**

An interactive 3D digital twin of the world's first Linglong-One (ACP100) SMR complex, integrating medical isotope production, nuclear science education, and zero-carbon circular agriculture into one immersive web experience.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| 3D Engine | Three.js 0.185 (WebGL) |
| Map | Leaflet + Amap (GCJ-02) |
| Routing | React Router v7 |

## Features

- **3D Facility Digital Twin** — 11 buildings (reactor dome, turbine hall, hot cells, cooling towers, greenhouses, etc.) with click-to-enter interior modeling and smooth camera transitions
- **Medical Isotope Supply Chain Map** — Real interactive map with animated flow lines showing Mo-99/Lu-177/I-131 delivery routes from Hainan to SE Asia
- **Radiation Blind Box Challenge** — Interactive quiz comparing radiation doses from everyday objects vs. nuclear facilities
- **Carbon Calculator** — Coal vs. uranium energy density comparison
- **Live Monitoring Dashboard** — Simulated reactor parameters and environmental radiation data
- **Responsive Design** — Glass-morphism UI with gradient branding

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Project Structure

```
src/
├── components/     # Navbar, Footer, Icons
├── pages/          # HomePage, AboutPage, MedicinePage, SciencePage,
│                   # AgriculturePage, DataCenter
├── three/          # FacilityScene — Three.js 3D engine
├── data/           # facility.ts, isotopes.ts, radiation.ts
└── utils/          # physics.ts — carbon calculator
```

## License

MIT — HackAtom 2026 Competition Entry
