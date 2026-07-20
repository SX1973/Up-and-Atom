import { useState, useEffect, useRef } from 'react';
import { isotopes, supplyChain, changjiangCoords } from '../data/isotopes';
import { PackageIcon, AtomIcon, FlaskIcon, SyringeIcon } from '../components/Icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const steps = [
  { title: 'Target Preparation', desc: 'High-purity TeO₂ targets are sealed in a cleanroom and loaded into dedicated irradiation capsules.', Icon: PackageIcon },
  { title: 'In-Reactor Irradiation', desc: 'Targets are inserted into spare channels of the Linglong-One core. Neutron bombardment converts Te-130 into Mo-99. Irradiation cycle: 5–7 days.', Icon: AtomIcon },
  { title: 'Hot Cell Separation', desc: 'Irradiated targets are delivered via pneumatic transfer into hot cells. Remote manipulators behind 1.5 m of heavy concrete shielding perform chemical separation and purification.', Icon: FlaskIcon },
  { title: 'Radiopharmaceutical Packaging', desc: 'Purified Mo-99 is loaded onto Tc-99m generator columns. After GMP quality control, products are cold-chain shipped to hospitals across Southeast Asia.', Icon: SyringeIcon },
];

// Fix Leaflet default icon paths with Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── WGS-84 → GCJ-02 coordinate transformation ──
// Required for Chinese map tiles (Gaode / Amap) to align markers correctly
const PI = Math.PI;
const A = 6378245.0;
const EE = 0.00669342162296594323;

function _transformLat(x: number, y: number): number {
  let r = -100 + 2*x + 3*y + 0.2*y*y + 0.1*x*y + 0.2*Math.sqrt(Math.abs(x));
  r += (20*Math.sin(6*x*PI) + 20*Math.sin(2*x*PI)) * 2/3;
  r += (20*Math.sin(y*PI) + 40*Math.sin(y/3*PI)) * 2/3;
  r += (160*Math.sin(y/12*PI) + 320*Math.sin(y*PI/30)) * 2/3;
  return r;
}

function _transformLng(x: number, y: number): number {
  let r = 300 + x + 2*y + 0.1*x*x + 0.1*x*y + 0.1*Math.sqrt(Math.abs(x));
  r += (20*Math.sin(6*x*PI) + 20*Math.sin(2*x*PI)) * 2/3;
  r += (20*Math.sin(x*PI) + 40*Math.sin(x/3*PI)) * 2/3;
  r += (150*Math.sin(x/12*PI) + 300*Math.sin(x/30*PI)) * 2/3;
  return r;
}

function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  // Outside China — return unchanged
  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) {
    return [lng, lat];
  }
  let dLat = _transformLat(lng - 105, lat - 35);
  let dLng = _transformLng(lng - 105, lat - 35);
  const radLat = lat / 180 * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
  dLng = (dLng * 180) / (A / sqrtMagic * Math.cos(radLat) * PI);
  return [lng + dLng, lat + dLat];
}

function SupplyChainMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      center: [16, 112],
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: true,
      dragging: true,
    });

    // Gaode (Amap) tiles — correct China boundary, GCJ-02 CRS
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      attribution: '&copy; Amap',
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;

    // All WGS-84 coords must be converted to GCJ-02 for correct positioning on Gaode tiles
    const czWgs = changjiangCoords;
    const cz = { lat: wgs84ToGcj02(czWgs.lng, czWgs.lat)[1], lng: wgs84ToGcj02(czWgs.lng, czWgs.lat)[0] };

    // Convert all city coords
    const citiesGcj = supplyChain.map(c => {
      const [lng, lat] = wgs84ToGcj02(c.lng, c.lat);
      return { ...c, lat, lng };
    });

    // Changjiang hub marker (blue pulse)
    const hubIcon = L.divIcon({
      html: `<div style="width:24px;height:24px;background:#3b82f6;border:4px solid #fff;border-radius:50%;box-shadow:0 0 18px rgba(59,130,246,0.8);animation:pulse 1.5s infinite;"></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const hubMarker = L.marker([cz.lat, cz.lng], { icon: hubIcon }).addTo(map);
    hubMarker.bindTooltip('🔬 Hainan Changjiang · Linglong-One', {
      permanent: true,
      direction: 'top',
      offset: [0, -10],
      className: 'map-hub-label',
    });

    // City markers
    const cityIcon = L.divIcon({
      html: `<div style="width:13px;height:13px;background:#22c55e;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(34,197,94,0.6);"></div>`,
      className: '',
      iconSize: [13, 13],
      iconAnchor: [6, 6],
    });

    // ── Flow lines with animated dashes + traveling glow dots ──
    const flowLines: L.Polyline[] = [];
    const ALL_DOTS: { dot: L.CircleMarker; city: typeof citiesGcj[number]; speed: number; phase: number }[] = [];

    citiesGcj.forEach((city) => {
      const m = L.marker([city.lat, city.lng], { icon: cityIcon }).addTo(map);
      m.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;">
          <strong>${city.city}</strong> · ${city.country}<br/>
          ✈ Flight ~ <strong>${city.flightHours} hours</strong><br/>
          <span style="color:#64748b;font-size:11px;">Mo-99 half-life 66 h → activity >95% on arrival</span>
        </div>
      `);

      // Wide, bright flow line
      const line = L.polyline(
        [[cz.lat, cz.lng], [city.lat, city.lng]],
        { color: '#3b82f6', weight: 4, opacity: 0.55, dashArray: '16 12', lineCap: 'round' }
      ).addTo(map);
      flowLines.push(line);

      // Three dots per line at different phases for dense flow
      for (let d = 0; d < 3; d++) {
        const dot = L.circleMarker([cz.lat, cz.lng], {
          radius: 4.5,
          color: '#2563eb',
          fillColor: '#93c5fd',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        ALL_DOTS.push({ dot, city, speed: 0.35 + d * 0.04, phase: d * 0.33 });
      }
    });

    // ── Dash animation ──
    const DASH_TOTAL = 28; // 16 + 12
    let dashOffset = 0;
    function animateDash() {
      dashOffset = (dashOffset + 0.7) % DASH_TOTAL;
      for (const line of flowLines) {
        line.setStyle({ dashOffset: -dashOffset } as any);
      }
    }

    // ── Dot animation ──
    function animateDots(startTime: number) {
      const elapsed = (performance.now() - startTime) * 0.001;
      for (const { dot, city, speed, phase } of ALL_DOTS) {
        const raw = (elapsed * speed + phase) % 2; // 0..2 cycle
        let progress: number;
        if (raw <= 1) {
          progress = easeInOutQuad(raw);
        } else {
          progress = 1 - easeInOutQuad(raw - 1);
        }
        const lat = cz.lat + (city.lat - cz.lat) * progress;
        const lng = cz.lng + (city.lng - cz.lng) * progress;
        dot.setLatLng([lat, lng]);
        const opacity = raw <= 1 ? 0.9 : 0.35;
        dot.setStyle({ fillOpacity: opacity, opacity: raw <= 1 ? 1 : 0.3 } as any);
      }
    }

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // ── Combined render loop ──
    let lastDash = 0;
    function loop(timestamp: number) {
      if (timestamp - lastDash > 32) {
        animateDash();
        lastDash = timestamp;
      }
      animateDots(timestamp);
      if (mapInstance.current) {
        animRef.current = requestAnimationFrame(loop);
      }
    }
    animRef.current = requestAnimationFrame(loop);

    // Fit bounds tightly around all cities + Changjiang
    const allPoints: [number, number][] = [
      [cz.lat, cz.lng],
      ...citiesGcj.map(c => [c.lat, c.lng] as [number, number]),
    ];
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [30, 30] });
    map.setMinZoom(4);
    map.setMaxZoom(8);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      cancelAnimationFrame(animRef.current);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px', borderRadius: '0.75rem' }} />;
}

export default function MedicinePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-800">Medical Isotope Production Center</h1>
        <p className="text-slate-500 mb-12">Zone A — SMR-driven Medical Isotope Production</p>

        <section className="glass rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-3 text-slate-800">Why Can an SMR Produce Nuclear Medicine?</h2>
          <p className="text-slate-600 leading-relaxed">
            The Linglong-One reactor core has spare neutron flux positions. By inserting specially designed target
            materials (e.g., high-purity TeO₂) into these positions and utilizing <code className="text-blue-600 bg-blue-50 px-1 rounded">(n,γ)</code> nuclear reactions,
            stable isotopes are converted into medical radioisotopes. In essence, we "borrow" neutrons from the
            reactor to "make medicine" — without affecting normal power generation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Production Process</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {steps.map(({ title, Icon }, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  i === activeStep ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}>
                <Icon /> {title}
              </button>
            ))}
          </div>
          <div className="glass rounded-xl p-8 text-center min-h-[180px] flex flex-col items-center justify-center">
            <div className="text-5xl mb-4 text-blue-600">
              {(() => { const S = steps[activeStep].Icon; return <S />; })()}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Step {activeStep + 1}: {steps[activeStep].title}</h3>
            <p className="text-slate-500 max-w-lg">{steps[activeStep].desc}</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Three Product Lines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {isotopes.map((iso) => (
              <div key={iso.id} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-1">{iso.name}</h3>
                <p className="text-xs text-slate-400 mb-3">Half-life: {iso.halfLife}</p>
                <p className="text-sm text-slate-600 mb-2">{iso.use}</p>
                <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Annual Output</span><span className="text-slate-700">{iso.annualOutput}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Can Serve</span><span className="text-slate-700">{iso.patientsPerYear}</span></div>
                  <div className="flex justify-between text-xs mt-2"><span className="text-slate-400">Current Supply</span><span className="text-amber-600 text-right max-w-[60%]">{iso.currentSupply}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-800">SE Asia Nuclear Medicine Supply Network</h2>
          <div className="glass rounded-xl p-6">
            <p className="text-sm text-slate-500 mb-4">
              Hainan Changjiang ({changjiangCoords.lat}&deg;N, {changjiangCoords.lng}&deg;E) is the production base.
              All flights are well within half the Mo-99 half-life (66 h).
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <SupplyChainMap />
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">All destinations &lt; 10% of Mo-99 half-life (66 h) by air &middot; Activity maintained &gt;95% on arrival</p>
          </div>
        </section>
      </div>
    </div>
  );
}
