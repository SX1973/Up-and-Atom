import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AtomIcon } from './Icons';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/medicine', label: 'Nuclear Medicine' },
  { to: '/science', label: 'Science Park' },
  { to: '/agriculture', label: 'Agriculture' },
  { to: '/data', label: 'Data Center' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-wide">
          <span className="text-blue-600 text-xl"><AtomIcon /></span>
          <span className="gradient-text">Silk Road Nuclear Light</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.to} to={link.to}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === link.to ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}>{link.label}</Link>
          ))}
        </div>
        <button className="md:hidden p-2 text-slate-500 hover:text-slate-800" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden glass border-t border-black/5 px-4 pb-4">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-sm ${
                location.pathname === link.to ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
              }`}>{link.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
