import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import PricingModal from './components/PricingModal';
import Toast from './components/Toast';

import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import Categories from './pages/Categories';
import ApiDocs from './pages/ApiDocs';
import Pricing from './pages/Pricing';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  return (
    <div className="light-theme min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white transition-colors relative font-sans text-slate-900">
      {/* Foreground UI Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPricing={() => setPricingOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Home onOpenPricing={() => setPricingOpen(true)} />} />
            <Route path="/tools/:toolId" element={<ToolDetail onShowToast={showToast} onOpenPricing={() => setPricingOpen(true)} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId" element={<Categories />} />
            <Route path="/api-docs" element={<ApiDocs onShowToast={showToast} />} />
            <Route path="/pricing" element={<Pricing onShowToast={showToast} />} />
            <Route path="*" element={<Home onOpenPricing={() => setPricingOpen(true)} />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Quick Search Modal (Cmd+K) */}
        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Pro Tier Upgrade Modal */}
        <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />

        {/* Global Toast */}
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
    </div>
  );
}
