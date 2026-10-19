import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES, TOOLS_LIST } from '../data/toolsData';
import ToolCard from '../components/ToolCard';
import { Layers, ArrowLeft } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

export default function Categories() {
  const { categoryId } = useParams();

  const activeCategory = categoryId || 'all';

  const displayedCategories = activeCategory === 'all'
    ? CATEGORIES.filter(c => c.id !== 'all')
    : CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
            <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">Tool Categories</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
            {activeCategory === 'all' ? 'All Tool Categories' : `${activeCategory.toUpperCase()} Category`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans max-w-xl">
            Carefully curated collections of high-performance utilities built for maximum developer, student, and creator productivity.
          </p>
        </div>

        {activeCategory !== 'all' && (
          <Link
            to="/categories"
            onClick={playPopSound}
            className="px-4 py-2.5 rounded-xl bg-[#181b22] border border-[#222631] text-slate-300 hover:text-white hover:border-[#323846] text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>All Categories</span>
          </Link>
        )}
      </div>

      <div className="space-y-12">
        {displayedCategories.map(cat => {
          const categoryTools = TOOLS_LIST.filter(t => t.category === cat.id);
          return (
            <div key={cat.id} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#222631]">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                    {cat.name}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 font-mono">
                    {categoryTools.length} tools
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
