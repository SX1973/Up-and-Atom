export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-800">About Us</h1>
        <p className="text-slate-500 mb-12">About Belt &amp; Road Nuclear Light Complex</p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Mission</h2>
          <div className="glass rounded-2xl p-8">
            <p className="text-xl text-slate-700 leading-relaxed">
              <span className="gradient-text font-bold">"Making Nuclear Visible, Tangible &amp; Trusted"</span>
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Nuclear energy is a clean, reliable, zero-carbon baseload power source. Yet three historic accidents
              have left an entrenched fear in the public mind. The root of this fear is not that nuclear energy is
              unsafe — it is that nuclear energy is <em>invisible</em>: safety systems are encased in concrete shells,
              radiation has no color or smell, and technical reports are unreadable to the average person.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              The mission of Silk Road Nuclear Light is to translate the safety and value of nuclear energy into
              a language everyone can see, touch, and experience.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Location — Hainan Changjiang</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Linglong-One: World\'s First SMR', desc: 'CNNC\'s ACP100 modular small reactor (SMR), construction started 2021, expected operation 2026. The world\'s first land-based commercial SMR and the technical core of this project.' },
              { title: 'Hainan Free Trade Port', desc: '"Zero tariff, low tax rate" policy advantages targeting 600 million people across 10 Southeast Asian nations. Home to the Boao Forum for Asia.' },
              { title: 'Geologically Stable', desc: 'Changjiang lies in the stable South China Block with no recorded strong earthquakes (M≥6) in history. Hainan\'s west coast is far less exposed to direct typhoon landfall than the east coast.' },
              { title: 'Optimal Radius for SE Asia', desc: 'Hainan → Bangkok 3 h, → Hanoi 2 h, → Manila 3 h — all major SE Asian cities are within the Mo-99 half-life (66 h) transport window.' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Alignment with IAEA Infrastructure Issues</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm glass rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 text-slate-700">Issue #</th>
                  <th className="text-left p-4 text-slate-700">Title</th>
                  <th className="text-left p-4 text-slate-700">Corresponding Zone</th>
                  <th className="text-left p-4 text-slate-700">Implementation</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  ['#10', 'Stakeholder Involvement', 'Zone B — Science Park', 'Radiation blind-box, transparent data wall, VR experience'],
                  ['#7',  'Human Resource Development', 'Zone B — Study Programs', 'Nuclear science education & study tours for SE Asia'],
                  ['#2',  'Nuclear Safety', 'Zone A + B', 'Hot-cell shielding, real-time public monitoring, transparency'],
                  ['#15', 'Nuclear Fuel Cycle', 'Zone A — Medical Isotopes', 'Reactor neutron irradiation for medical isotope production'],
                  ['#12', 'Environmental Protection', 'Zone C — Zero-Carbon Agriculture', 'Waste-heat utilization, carbon reduction, circular economy'],
                  ['#1',  'National Position', 'Entire Project', 'Building the public trust foundation for nuclear energy policy'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-4 text-blue-600 font-medium">{row[0]}</td>
                    <td className="p-4">{row[1]}</td>
                    <td className="p-4">{row[2]}</td>
                    <td className="p-4">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
