import React from 'react';
import { Search, Sparkles, ShieldCheck, Zap, Compass, Laptop } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';

export default function Hero({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <div className="relative pt-6 sm:pt-10 pb-8 sm:pb-14 text-center">
      
      {/* Creator & Platform Intro Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#13151b] border border-[#222631] text-xs font-semibold text-slate-300 shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white font-semibold">Personal Tools Workstation</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400 font-sans">Crafted by <strong className="text-slate-200 font-semibold">Bijesh Sharma</strong></span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-indigo-400 font-mono text-[11px] hidden sm:inline">100% Free Forever</span>
      </div>

      {/* Hero Display Headline (Clean, confident, human editorial typography) */}
      <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
        Every tool you need, <br className="hidden sm:inline" />
        <span className="text-slate-200">
          engineered for daily productivity.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
        A single unified workstation for students, developers, creators, freelancers, and businesses. Execute everything locally in your browser with zero data harvesting.
      </p>

      {/* 4 Clean Human-Crafted Value Proposition Cards */}
      <div className="mt-8 max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-4">
        {/* Card 1: Privacy */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] shadow-sm transition-all flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-display">100% In-Browser</div>
            <div className="text-[11px] text-slate-400">Zero data collection</div>
          </div>
        </div>

        {/* Card 2: Speed */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] shadow-sm transition-all flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-display">&lt;2ms Latency</div>
            <div className="text-[11px] text-slate-400">Instant local compute</div>
          </div>
        </div>

        {/* Card 3: Nepal Suite */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] shadow-sm transition-all flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-display">Nepal Suite</div>
            <div className="text-[11px] text-slate-400">BS date, typing & tax</div>
          </div>
        </div>

        {/* Card 4: Zero Installs */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] shadow-sm transition-all flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-display">Zero Installs</div>
            <div className="text-[11px] text-slate-400">Runs right in browser</div>
          </div>
        </div>
      </div>

      {/* Clean Studio Search Box */}
      <div className="mt-8 max-w-2xl mx-auto px-4">
        <div className="relative flex items-center p-2 rounded-2xl bg-[#13151b] border border-[#222631] shadow-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all duration-200 group">
          <Search className="w-5 h-5 ml-3.5 text-slate-400 shrink-0 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search utilities (e.g. JSON, BS-AD Date, QR, Email, Words)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3.5 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="mr-2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#181b22] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-lg bg-[#181b22] border border-[#222631] text-[11px] font-mono text-slate-400">
              <span>Press</span>
              <kbd className="text-slate-200 font-bold bg-[#222631] px-1 rounded">Ctrl K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* Refined Category Filter Pills */}
      <div className="mt-8 max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105 border border-indigo-400/30'
                    : 'bg-[#13151b] border border-[#222631] text-slate-300 hover:text-white hover:border-[#323846] hover:bg-[#181b22]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.count && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-[#181b22] text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
