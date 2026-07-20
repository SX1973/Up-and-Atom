import { useState, useEffect, useCallback } from 'react';
import { pickChallengePair, RadiationItem } from '../data/radiation';
import { TargetIcon, ChartIcon, VRIcon, FireIcon, PartyIcon, BookIcon, GlobeIcon } from '../components/Icons';

const scienceTabs = [
  { id: 'blindbox' as const, label: 'Radiation Blind Box', Icon: TargetIcon },
  { id: 'dashboard' as const, label: 'Live Monitor (Sim)', Icon: ChartIcon },
  { id: 'vr' as const, label: 'VR Experience', Icon: VRIcon },
];

function BlindBoxChallenge() {
  const [pair, setPair] = useState<[RadiationItem, RadiationItem]>(pickChallengePair);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [history, setHistory] = useState<{ item1: string; item2: string; choice: string; correct: boolean }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const totalRounds = 10;

  const handleChoice = useCallback((chosen: RadiationItem, other: RadiationItem) => {
    const correct = chosen.value >= other.value;
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); setLastResult('correct'); }
    else { setStreak(0); setLastResult('wrong'); }
    setHistory(h => [...h, { item1: pair[0].name, item2: pair[1].name, choice: chosen.name, correct }]);
    const nr = round + 1;
    setRound(nr);
    if (nr >= totalRounds) { setGameOver(true); }
    else { setPair(pickChallengePair()); }
  }, [round, pair]);

  const restart = () => {
    setScore(0); setRound(0); setStreak(0); setLastResult(null);
    setHistory([]); setGameOver(false); setPair(pickChallengePair());
  };

  if (gameOver) {
    const rating = score >= 9 ? 'Nuclear Ambassador' : score >= 7 ? 'Radiation Detective' : score >= 4 ? 'Science Rising Star' : 'Beginner';
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="text-5xl mb-4 text-amber-500">{score >= 7 ? <PartyIcon /> : <BookIcon />}</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Challenge Complete!</h3>
        <p className="text-3xl font-bold gradient-text mb-1">{score} / {totalRounds}</p>
        <p className="text-slate-500 mb-2">Title: {rating}</p>
        {score >= 7 && <p className="text-sm text-green-600 mt-4 max-w-md mx-auto">Remember: <strong>Radiation at an NPP site boundary is lower than eating a single banana.</strong></p>}
        <div className="mt-6 space-y-2 max-w-sm mx-auto">
          {history.map((h, i) => (
            <div key={i} className={`flex justify-between text-xs ${h.correct ? 'text-green-600' : 'text-red-500'}`}>
              <span>{h.item1} vs {h.item2}</span><span>{h.correct ? '✓' : '✗'} picked {h.choice}</span>
            </div>
          ))}
        </div>
        <button onClick={restart} className="mt-6 px-6 py-2 bg-blue-500/85 hover:bg-blue-500 rounded-full text-sm transition-colors text-white">Play Again</button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-6 text-sm">
        <span className="text-slate-500">Round {round + 1}/{totalRounds}</span>
        <span className="text-blue-600 font-medium">Score: {score}</span>
        {streak >= 3 && <span className="text-amber-500 animate-pulse font-medium"><FireIcon /> {streak} Streak!</span>}
      </div>
      <p className="text-center text-slate-600 mb-8">Which has higher radiation?</p>
      <div className="flex items-center justify-center gap-4 md:gap-12">
        <button onClick={() => handleChoice(pair[0], pair[1])} className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all hover:scale-105 min-w-[140px]">
          <span className="text-5xl">{pair[0].icon}</span>
          <span className="text-slate-800 font-medium text-sm text-center">{pair[0].name}</span>
        </button>
        <span className="text-slate-300 text-2xl font-bold">VS</span>
        <button onClick={() => handleChoice(pair[1], pair[0])} className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all hover:scale-105 min-w-[140px]">
          <span className="text-5xl">{pair[1].icon}</span>
          <span className="text-slate-800 font-medium text-sm text-center">{pair[1].name}</span>
        </button>
      </div>
      {lastResult && (
        <div className={`mt-6 p-3 rounded-lg text-center text-sm ${lastResult === 'correct' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {lastResult === 'correct' ? '✓ Correct!' : '✗ Wrong!'} {' '}
          <span className="text-slate-500">{pair[0].name}: {pair[0].value} μSv/h | {pair[1].name}: {pair[1].value} μSv/h</span>
        </div>
      )}
    </div>
  );
}

function MonitoringDashboard() {
  const [data, setData] = useState({ power: 385, pressure: 15.5, temperature: 325, siteBoundary: 0.08, changjiang: 0.07, sanya: 0.07, haikou: 0.06 });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        power: 385 + (Math.random() - 0.5) * 2,
        pressure: 15.5 + (Math.random() - 0.5) * 0.05,
        temperature: 325 + (Math.random() - 0.5) * 1,
        siteBoundary: 0.08 + (Math.random() - 0.5) * 0.01,
        changjiang: 0.07 + (Math.random() - 0.5) * 0.01,
        sanya: 0.07 + (Math.random() - 0.5) * 0.01,
        haikou: 0.06 + (Math.random() - 0.5) * 0.01,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 font-semibold">Linglong-One &middot; Operating Status (Simulated)</h3>
        <span className="flex items-center gap-1.5 text-xs text-green-600"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Normal Operation</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Core Thermal Power', val: data.power, unit: 'MWt', design: 385, color: 'bg-blue-500' },
          { label: 'Primary Loop Pressure', val: data.pressure, unit: 'MPa', design: 17.2, color: 'bg-cyan-500' },
          { label: 'Coolant Outlet Temp', val: data.temperature, unit: '°C', design: 350, color: 'bg-orange-500' },
        ].map((item) => (
          <div key={item.label} className="glass rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">{item.val.toFixed(item.val < 10 ? 2 : 1)} <span className="text-sm text-slate-400">{item.unit}</span></p>
            <div className="bg-slate-200 rounded-full overflow-hidden h-3 mt-2">
              <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (item.val / item.design) * 100)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Design: {item.design} {item.unit}</p>
          </div>
        ))}
      </div>
      <h4 className="text-sm text-slate-600 mb-3"><GlobeIcon className="text-green-600 mr-1" />Environmental Radiation Monitoring (μSv/h)</h4>
      <div className="space-y-3">
        {[
          { label: 'Controlled Area (Site Center)', value: 120.5, max: 1000, color: 'bg-amber-500', note: 'Radiation work permit required', fixed: true },
          { label: 'Site Boundary', value: data.siteBoundary, max: 1, color: 'bg-green-500', note: '≈ eating 1 banana' },
          { label: 'Changjiang Town', value: data.changjiang, max: 1, color: 'bg-green-500', note: 'Hainan natural background' },
          { label: 'Sanya City', value: data.sanya, max: 1, color: 'bg-green-500', note: 'No significant difference' },
          { label: 'Haikou City', value: data.haikou, max: 1, color: 'bg-green-500', note: 'Northern Hainan background' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-36 shrink-0">{item.label}</span>
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} />
            </div>
            <span className="text-xs text-slate-700 w-20 text-right font-mono">{typeof item.value === 'number' ? item.value.toFixed(2) : item.value}</span>
            <span className="text-xs text-slate-400 hidden md:block w-48">{item.note}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
        <p className="text-sm text-green-600">All environmental monitoring points are within the green safety zone.</p>
      </div>
    </div>
  );
}

export default function SciencePage() {
  const [tab, setTab] = useState<'blindbox' | 'dashboard' | 'vr'>('blindbox');

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-800">Immersive Science Experience</h1>
        <p className="text-slate-500 mb-12">Zone B — Interactive Nuclear Science Park</p>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">Core Concept</h2>
          <p className="text-slate-600 leading-relaxed">
            Traditional nuclear outreach <em>tells</em> you facts. We let you <em>experience</em> them. Three interactive
            zones target three cognitive goals: <strong>See the data</strong> (Transparent Reactor Wall),{' '}
            <strong>Test it yourself</strong> (Radiation Blind Box), and <strong>Step inside</strong> (VR Journey).
          </p>
        </section>

        <div className="flex gap-2 mb-6 flex-wrap">
          {scienceTabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1.5 ${tab === id ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              <Icon /> {label}
            </button>
          ))}
        </div>

        <div className={tab === 'blindbox' ? '' : 'hidden'}><BlindBoxChallenge /></div>
        <div className={tab === 'dashboard' ? '' : 'hidden'}><MonitoringDashboard /></div>
        <div className={tab === 'vr' ? '' : 'hidden'}>
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-6xl mb-4 text-blue-600"><VRIcon /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">"Inside Linglong-One" VR Experience</h3>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Start on a Hainan beach &rarr; Pass through the reactor building wall &rarr; Enter the pressure vessel &rarr;
              Fly between fuel rods from a "neutron's perspective" &rarr; Witness the moment fission releases heat &rarr;
              Exit through the cooling tower as vapor rises into clouds &rarr; Return to reality. ~8 minute experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
