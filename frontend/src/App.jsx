import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FeaturesPage from './pages/Features';
import AboutPage from './pages/About';
import { AnimatePresence } from 'framer-motion';

import Footer from './components/Footer';

import NewsPage from './pages/NewsPage';
import BacktestPage from './pages/BacktestPage';
import HeatmapPage from './pages/HeatmapPage';
import PriceAnalysisPage from './pages/PriceAnalysisPage';
import DocsPage from './pages/DocsPage';
import TermsPage from './pages/TermsPage';

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/backtest" element={<BacktestPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/analysis" element={<PriceAnalysisPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
