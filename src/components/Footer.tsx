export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-sm text-slate-400">
      <p>&copy; {new Date().getFullYear()} Silk Road Nuclear Light — Hainan Changjiang International SMR Science, Tourism &amp; Medical Isotope Complex</p>
      <p className="mt-1">Data Sources: CNNC &middot; IAEA PRIS &middot; UNSCEAR &middot; IPCC &middot; WNA &nbsp;|&nbsp; HackAtom 2026 Competition Entry</p>
    </footer>
  );
}
