import { useState, useEffect } from 'react';
import { GlobeIcon, ClipboardIcon, ShieldIcon } from '../components/Icons';

const reactorParams = [
  { label: 'Core Thermal Power', key: 'power' as const, unit: 'MWt', design: '385' },
  { label: 'Electric Power', key: 'electricity' as const, unit: 'MWe', design: '125' },
  { label: 'Primary Loop Pressure', key: 'pressure' as const, unit: 'MPa', design: '15.5' },
  { label: 'Coolant Outlet Temp', key: 'tempOut' as const, unit: '°C', design: '325' },
  { label: 'Coolant Inlet Temp', key: 'tempIn' as const, unit: '°C', design: '292' },
  { label: 'Coolant Flow Rate', key: 'flow' as const, unit: 't/h', design: '12800' },
  { label: 'Cooling Water ΔT', key: 'coolingDeltaT' as const, unit: '°C', design: '5-8' },
  { label: 'Containment Pressure', key: 'containmentPressure' as const, unit: 'MPa', design: '<0.5' },
];

const radMonitors = [
  { label: 'Controlled Area (Site Center)', key: 'radContainment' as const, max: 1000, color: '#d97706', barColor: 'bg-amber-500', note: 'Radiation work permit required for entry' },
  { label: 'Site Boundary', key: 'radBoundary' as const, max: 1, color: '#16a34a', barColor: 'bg-green-500', note: '≈ eating 1 banana (0.1 μSv)' },
  { label: 'Changjiang Town', key: 'radChangjiang' as const, max: 1, color: '#16a34a', barColor: 'bg-green-500', note: 'Hainan natural background level' },
  { label: 'Sanya City', key: 'radSanya' as const, max: 1, color: '#16a34a', barColor: 'bg-green-500', note: 'No statistical difference from Changjiang' },
  { label: 'Haikou City', key: 'radHaikou' as const, max: 1, color: '#16a34a', barColor: 'bg-green-500', note: 'Northern Hainan background level' },
];

const refTable = [
  ['Eating 1 banana', '0.1 μSv', 'Natural K-40 isotope'],
  ['1 hour at NPP site boundary', '0.08 μSv', 'Below natural background fluctuation'],
  ['1 hour high-altitude flight', '5.0 μSv', 'Cosmic rays increase with altitude'],
  ['Chest X-ray', '100 μSv', '≈ 52 continuous days at NPP site boundary'],
  ['Chest CT', '7,000 μSv', '≈ 10 continuous years at NPP site boundary'],
  ['Whole-body PET-CT', '25,000 μSv', 'Used for precise cancer localization; benefit far outweighs risk'],
];

export default function DataCenter() {
  const [time, setTime] = useState(new Date());
  const [monitoring, setMonitoring] = useState({
    power: 385.0, electricity: 125.0, pressure: 15.50, tempIn: 292.0, tempOut: 325.0,
    flow: 12800, radContainment: 120.5, radBoundary: 0.08,
    radChangjiang: 0.07, radSanya: 0.07, radHaikou: 0.06, coolingDeltaT: 7.2,
    containmentPressure: 0.12,
  });

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const g = (b: number, r: number) => b + (Math.random() - 0.5) * r;
    const interval = setInterval(() => {
      setMonitoring({
        power: g(385, 3), electricity: g(125, 1), pressure: g(15.5, 0.1), tempIn: g(292, 2),
        tempOut: g(325, 1.5), flow: g(12800, 100), radContainment: g(120.5, 5),
        radBoundary: g(0.08, 0.015), radChangjiang: g(0.07, 0.01), radSanya: g(0.07, 0.01),
        radHaikou: g(0.06, 0.01), coolingDeltaT: g(7.2, 0.5), containmentPressure: g(0.12, 0.01),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-to-b from-sky-50 to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1 text-slate-800">Data Center</h1>
            <p className="text-slate-500">Linglong-One Operational Monitoring &amp; Emissions Disclosure Platform (Simulated Data)</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-400">{fmt(time)}</p>
            <p className="text-green-600 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />All Parameters Normal
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800"><ShieldIcon className="text-blue-600 mr-1" />Reactor Operating Parameters</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reactorParams.map((item) => (
              <div key={item.label} className="glass rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {monitoring[item.key].toFixed(1)}<span className="text-sm text-slate-400 ml-1">{item.unit}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Design: {item.design} {item.unit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800"><GlobeIcon className="text-green-600 mr-1" />Environmental Radiation Monitoring</h2>
          <div className="glass rounded-xl p-6">
            {radMonitors.map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-3 mb-2 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{monitoring[item.key].toFixed(2)} μSv/h</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${item.barColor}`} style={{ width: `${Math.min(100, monitoring[item.key] / item.max * 100)}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-800"><ClipboardIcon className="text-slate-500 mr-1" />Radiation Reference Guide</h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200"><th className="text-left p-3 text-slate-500">Source</th><th className="text-right p-3 text-slate-500">Dose</th><th className="text-left p-3 text-slate-500 hidden md:table-cell">Notes</th></tr></thead>
              <tbody className="text-slate-600">
                {refTable.map(([src, dose, note]) => (
                  <tr key={src} className="border-b border-slate-100">
                    <td className="p-3">{src}</td>
                    <td className="text-right p-3 font-medium" style={{ color: dose.includes('000') ? '#ef4444' : '#16a34a' }}>{dose}</td>
                    <td className="p-3 text-slate-400 hidden md:table-cell">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">Data Sources: UNSCEAR 2020/2021, IAEA, WHO | Simulated data for demonstration only</p>
        </section>
      </div>
    </div>
  );
}
