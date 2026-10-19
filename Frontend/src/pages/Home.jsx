import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ShieldCheck, Zap, ArrowRight, Heart, Star, Clock, Calendar, Crown, Flame } from 'lucide-react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { TOOLS_LIST } from '../data/toolsData';
import { getFavorites, getRecentTools } from '../utils/storage';
import { playPopSound } from '../utils/soundEffects';

export default function Home({ onOpenPricing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);

  const loadSavedData = () => {
    const favIds = getFavorites();
    const recentIds = getRecentTools();
    setFavorites(TOOLS_LIST.filter(t => favIds.includes(t.id)));
    setRecents(TOOLS_LIST.filter(t => recentIds.includes(t.id)));
  };

  useEffect(() => {
    loadSavedData();
    const handleUpdate = () => loadSavedData();
    window.addEventListener('toolshub_storage_updated', handleUpdate);
    return () => window.removeEventListener('toolshub_storage_updated', handleUpdate);
  }, []);

  const filteredTools = TOOLS_LIST.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const nepalSuiteTools = TOOLS_LIST.filter(t => t.category === 'nepal');

  // Next Upcoming Festival calculation
  const upcomingFestivals = [
    { name: 'Tihar & Bhai Tika (Deepawali)', nepali: 'तिहार तथा भाइटीका', daysLeft: 14, icon: 'flame' },
    { name: 'Chhath Puja', nepali: 'छठ पर्व', daysLeft: 21, icon: 'sun' },
    { name: 'Maghe Sankranti', nepali: 'माघे संक्रान्ति', daysLeft: 88, icon: 'sparkles' },
    { name: 'Maha Shivaratri', nepali: 'महाशिवरात्रि', daysLeft: 125, icon: 'shield' },
    { name: 'Fagu Purnima (Holi)', nepali: 'फागु पूर्णिमा (होली)', daysLeft: 142, icon: 'palette' }
  ];

  const nextFestival = upcomingFestivals[0];

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Pinned Quick-Access Ribbon (Favorites & Recents) */}
      {!searchQuery && (favorites.length > 0 || recents.length > 0) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span>Quick Access:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(favorites.length > 0 ? favorites : recents).slice(0, 5).map(t => (
              <Link
                key={t.id}
                to={t.route}
                onClick={playPopSound}
                className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold border border-[#222631] hover:border-indigo-400 transition-all flex items-center gap-1.5 group cursor-pointer"
              >
                <span>{t.name}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-white transition-all">➔</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nepal Festival & Cultural Countdown Banner */}
      {!searchQuery && (
        <div className="p-6 sm:p-7 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Upcoming National Festival & Holiday
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 font-mono">
                  In {nextFestival.daysLeft} Days
                </span>
              </div>
              <h3 className="font-display text-base sm:text-xl font-bold text-white mt-1">
                {nextFestival.name} <span className="font-devanagari text-amber-300 font-semibold">({nextFestival.nepali})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                Plan ahead with our universal Bikram Sambat date converter, Devanagari Unicode typing, and official tax invoice generator.
              </p>
            </div>
          </div>

          <Link
            to="/tools/bs-ad-converter"
            onClick={playPopSound}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Nepali Calendar</span>
          </Link>
        </div>
      )}

      {/* Signature Nepal Localization Suite Section */}
      {(selectedCategory === 'all' || selectedCategory === 'nepal') && !searchQuery && (
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Compass className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Signature Nepal Localization Suite
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-bold border border-rose-500/20">
                  Featured
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Purpose-built utilities for Nepal: Universal Bikram Sambat date conversion, phonetic Devanagari typing, NPR amount to words, and IRD-compliant business tax invoices.
              </p>
            </div>

            <button
              onClick={() => {
                playPopSound();
                setSelectedCategory('nepal');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>View all Nepal utilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nepalSuiteTools.slice(0, 3).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Catalog Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#222631]">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Online Utilities' : `${selectedCategory.toUpperCase()} Tools`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing <strong className="text-white font-mono">{filteredTools.length}</strong> available utilities • <span className="text-emerald-400 font-semibold">✦ Local Browser Execution</span>
            </p>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-16 text-center p-8 rounded-2xl bg-[#13151b] border border-[#222631] max-w-md mx-auto">
            <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-display text-base text-slate-200 font-bold">No tools found matching "{searchQuery}"</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Try searching for common terms like "PDF", "JSON", "Date", "QR", "Email", or "Translate"
            </p>
            <button
              onClick={() => { 
                playPopSound();
                setSearchQuery(''); 
                setSelectedCategory('all'); 
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Pro Membership & Business API Banner */}
      <section className="p-7 sm:p-10 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Tools Hub Pro & Business API Engine</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
            Need unlimited disposable emails, high-speed batch processing & dedicated API keys?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-sans">
            Upgrade to Pro for just NPR 499/month ($4.99) with instant local payment through eSewa, Khalti, or Cards. Unlock unlimited AI translation tokens, unlimited disposable inboxes with live OTP verification, and Swagger API tokens.
          </p>
        </div>

        <button
          onClick={() => {
            playPopSound();
            onOpenPricing();
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all transform active:scale-95 shrink-0 cursor-pointer"
        >
          View Pro Plans (NPR 499/mo)
        </button>
      </section>
    </div>
  );
}
