import { useState } from 'react';
import { calculateCarbon } from '../utils/physics';
import { PalmTreeIcon, FishIcon, DnaIcon, LightningIcon, RockIcon, AtomIcon, ScaleIcon } from '../components/Icons';

export default function AgriculturePage() {
  const [dailyKm, setDailyKm] = useState(30);
  const [vehicleType, setVehicleType] = useState<'gasoline' | 'electric' | 'hybrid'>('gasoline');
  const [monthlyKwh, setMonthlyKwh] = useState(300);
  const [yearlyFlights, setYearlyFlights] = useState(2);
  const [result, setResult] = useState<ReturnType<typeof calculateCarbon> | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-800">Zero-Carbon Circular Agriculture</h1>
        <p className="text-slate-500 mb-12">Zone C — Zero-Carbon Circular Agriculture</p>

        <section className="glass rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-semibold mb-3 text-slate-800">Turning "Waste Heat" into a Resource</h2>
          <p className="text-slate-600 leading-relaxed">
            Linglong-One uses once-through seawater cooling, discharging water 5–8°C warmer than the receiving sea.
            Traditionally called "thermal discharge," but from another perspective, this is a year-round,
            stable-supply <strong className="text-emerald-600">free low-grade heat source</strong>.
            We use it to heat greenhouses and aquaculture ponds near the discharge point, creating a
            "nuclear → heat → harvest → income" green value chain.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Three Utilization Pathways</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: PalmTreeIcon, title: 'Off-Season Tropical Greenhouses', items: ['Warm discharge heat exchange for winter heating, maintaining 18–25°C', 'Off-season dragon fruit & durian seedling cultivation', '2–3× the price of in-season produce', 'Operating costs far below coal-heated greenhouses'] },
              { Icon: FishIcon, title: 'High-Value Warm-Water Aquaculture', items: ['Leopard coral grouper & pearl gentian grouper', 'Warm water shortens growth cycle by 15–20%', '2 harvests per year (vs. 1 normally)'] },
              { Icon: DnaIcon, title: 'Microalgae Bio-Cultivation', items: ['Spirulina — high-protein health supplement', 'Haematococcus pluvialis — natural astaxanthin source', 'Annual output value can exceed ¥100K/mu'] },
            ].map(({ Icon, title, items }) => (
              <div key={title} className="glass rounded-xl p-6">
                <div className="text-emerald-600 mb-3 text-4xl"><Icon /></div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{title}</h3>
                <ul className="text-sm text-slate-500 space-y-1.5">
                  {items.map((li, i) => <li key={i}>&middot; {li}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">More Importantly: Making Farmers Stakeholders of Nuclear Energy</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            <span className="text-emerald-600 font-semibold">"Community of Shared Interest"</span> —
            A farmer growing off-season dragon fruit in a nuclear-heated greenhouse won't fear nuclear energy — because
            they personally participate in the "nuclear → heat → harvest → income" value chain. When a nuclear plant
            transforms from "a strange building with smoke in the distance" into "the heat source for my greenhouse,"
            public trust gains its strongest foundation. This is IAEA Infrastructure Issue #10 "Stakeholder Involvement"
            in its best-practice form.
          </p>
        </section>

        {/* Carbon Calculator */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-800"><LightningIcon className="text-amber-500 mr-1" />"Carbon Buddy" Energy Comparison Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Daily Driving Distance (km)</label>
                <input type="range" min={0} max={200} value={dailyKm} onChange={e => setDailyKm(+e.target.value)} className="w-full accent-emerald-600" />
                <span className="text-slate-700 text-sm">{dailyKm} km</span>
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Vehicle Type</label>
                <div className="flex gap-2">
                  {(['gasoline', 'electric', 'hybrid'] as const).map(vt => (
                    <button key={vt} onClick={() => setVehicleType(vt)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${vehicleType === vt ? 'bg-emerald-500/20 text-emerald-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>
                      {vt === 'gasoline' ? 'Gasoline' : vt === 'electric' ? 'Electric' : 'Hybrid'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Monthly Electricity Use (kWh)</label>
                <input type="range" min={50} max={1000} step={10} value={monthlyKwh} onChange={e => setMonthlyKwh(+e.target.value)} className="w-full accent-emerald-600" />
                <span className="text-slate-700 text-sm">{monthlyKwh} kWh</span>
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Flights per Year</label>
                <input type="range" min={0} max={20} value={yearlyFlights} onChange={e => setYearlyFlights(+e.target.value)} className="w-full accent-emerald-600" />
                <span className="text-slate-700 text-sm">{yearlyFlights} flights</span>
              </div>
              <button onClick={() => setResult(calculateCarbon(dailyKm, vehicleType, monthlyKwh, yearlyFlights))}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors text-white">Calculate &amp; Compare</button>
            </div>
            <div className="glass rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
              {result ? (
                <div className="text-center">
                  <p className="text-slate-500 text-sm mb-2">Your Annual Carbon Footprint</p>
                  <p className="text-3xl font-bold text-slate-800 mb-4">{result.annualCO2Kg.toFixed(0)} <span className="text-lg text-slate-400">kg CO₂</span></p>
                  <p className="text-slate-500 text-sm mb-4">If replaced with SMR nuclear power</p>
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl mb-1 text-amber-600"><RockIcon /></div>
                      <p className="text-2xl font-bold text-amber-600">{result.coalKg.toFixed(0)}</p>
                      <p className="text-xs text-slate-400">kg coal</p>
                    </div>
                    <span className="text-slate-300">&rarr;</span>
                    <div className="text-center">
                      <div className="text-2xl mb-1 text-blue-600"><AtomIcon /></div>
                      <p className="text-2xl font-bold text-blue-600">{result.u235Grams.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">g uranium-235</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">&asymp; {result.treesEquivalent} trees' annual CO₂ absorption</p>
                  <p className="text-xs text-slate-400 mt-4 max-w-xs mx-auto leading-relaxed">
                    {result.coalKg > 1000
                      ? `${(result.coalKg / 1000).toFixed(1)} tonnes of coal ≈ an SUV, while the equivalent uranium fuel is lighter than a grain of rice`
                      : `${result.coalKg.toFixed(0)} kg of coal, vs. just ${result.u235Grams.toFixed(2)} g of uranium`}
                    — that's the energy density of nuclear power made tangible.
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 text-center">
                  <div className="text-4xl mb-3"><ScaleIcon /></div>
                  <p>Adjust the parameters</p><p className="text-sm">Click "Calculate &amp; Compare" to see results</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
