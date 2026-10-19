import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  Crown, 
  Volume2,
  VolumeX,
  Star,
  ArrowRight
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playPopSound } from '../utils/soundEffects';
import { getFavorites } from '../utils/storage';
import { TOOLS_LIST } from '../data/toolsData';

export default function Navbar({ onOpenSearch, onOpenPricing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [favDropdownOpen, setFavDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const location = useLocation();

  const loadFavorites = () => {
    const favIds = getFavorites();
    const favTools = TOOLS_LIST.filter(t => favIds.includes(t.id));
    setFavorites(favTools);
  };

  useEffect(() => {
    loadFavorites();
    const handleStorageUpdate = () => loadFavorites();
    window.addEventListener('toolshub_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('toolshub_storage_updated', handleStorageUpdate);
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playPopSound();
  };

  const navLinks = [
    { name: 'All Utilities', path: '/' },
    { name: 'Nepal Suite', path: '/categories/nepal' },
    { name: 'Categories', path: '/categories' },
    { name: 'API Docs', path: '/api-docs' },
    { name: 'Pricing', path: '/pricing' }
  ];

  return (
    <div className="sticky top-0 sm:top-3 z-50 w-full px-2 sm:px-4 lg:px-6 transition-all duration-200">
      <header className="max-w-7xl mx-auto rounded-none sm:rounded-2xl border-b sm:border border-[#222631] bg-[#111318]/95 backdrop-blur-xl shadow-lg shadow-black/40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <Link 
            to="/" 
            onClick={playPopSound}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 p-0.5 shadow-sm group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#13151b] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  Tools Hub
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
              <div className="text-[11px] text-slate-400 -mt-0.5 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">by Bijesh Sharma</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-indigo-400 text-[10px] font-mono hidden sm:inline">bijeshsharam.com.np</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={playPopSound}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={() => {
                playPopSound();
                onOpenSearch();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13151b] border border-[#222631] hover:border-[#323846] text-slate-300 hover:text-white text-xs transition-all cursor-pointer group"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="hidden md:inline font-medium">Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-[#181b22] text-slate-400 rounded border border-[#222631]">
                Ctrl K
              </kbd>
            </button>

            {/* Starred Favorites Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  playPopSound();
                  setFavDropdownOpen(!favDropdownOpen);
                }}
                className={`p-2 rounded-xl border transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  favDropdownOpen 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-[#13151b] border-[#222631] text-slate-400 hover:text-amber-400 hover:border-[#323846]'
                }`}
                title="Starred Favorites"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {favorites.length > 0 && (
                  <span className="text-[10px] font-bold text-amber-300 font-mono ml-0.5">
                    {favorites.length}
                  </span>
                )}
              </button>

              {favDropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-72 p-3 bg-[#13151b] border border-[#222631] rounded-2xl shadow-2xl z-50 animate-fade-in"
                  onMouseLeave={() => setFavDropdownOpen(false)}
                >
                  <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#222631] flex items-center justify-between">
                    <span>Favorite Utilities</span>
                    <span className="text-amber-400 font-mono text-xs font-bold">{favorites.length}</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#222631]/50 pt-1.5">
                    {favorites.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 leading-relaxed font-sans">
                        Click the star symbol (★) on any utility card to pin it here for rapid access.
                      </div>
                    ) : (
                      favorites.map(t => (
                        <Link
                          key={t.id}
                          to={t.route}
                          onClick={() => {
                            playPopSound();
                            setFavDropdownOpen(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#181b22] text-xs text-slate-200 hover:text-indigo-300 transition-colors"
                        >
                          <span className="font-semibold truncate">{t.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundOn 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300' 
                  : 'bg-[#13151b] border-[#222631] text-slate-500 hover:text-slate-300'
              }`}
              title={soundOn ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Pro Tier Button */}
            <button
              onClick={() => {
                playPopSound();
                onOpenPricing();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Pro Tier</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#13151b] border border-[#222631] text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#222631] bg-[#13151b] px-4 py-3 space-y-1.5 rounded-b-2xl animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  playPopSound();
                  setMobileMenuOpen(false);
                }}
                className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#181b22] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#222631]">
              <button
                onClick={() => {
                  playPopSound();
                  setMobileMenuOpen(false);
                  onOpenPricing();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-center font-bold text-sm"
              >
                Upgrade to Pro (NPR 499)
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
