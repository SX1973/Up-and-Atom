import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MedicinePage from './pages/MedicinePage';
import SciencePage from './pages/SciencePage';
import AgriculturePage from './pages/AgriculturePage';
import DataCenter from './pages/DataCenter';

const pageTitles: Record<string, string> = {
  '/': 'Silk Road Nuclear Light — Hainan Changjiang International SMR Complex',
  '/about': 'About — Silk Road Nuclear Light',
  '/medicine': 'Medical Isotope Production Center — Silk Road Nuclear Light',
  '/science': 'Immersive Science Experience — Silk Road Nuclear Light',
  '/agriculture': 'Zero-Carbon Circular Agriculture — Silk Road Nuclear Light',
  '/data': 'Data Center — Silk Road Nuclear Light',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = pageTitles[pathname] ?? 'Silk Road Nuclear Light';
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/medicine" element={<MedicinePage />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="/agriculture" element={<AgriculturePage />} />
            <Route path="/data" element={<DataCenter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
