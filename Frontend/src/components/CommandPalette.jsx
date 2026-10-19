import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsData';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filtered = TOOLS_LIST.filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        navigate(filtered[selectedIndex].route);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#13151b] border border-[#222631] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#222631]">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a tool name or category... (e.g. JSON, Nepal, PDF, EMI)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-[#181b22] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#222631]/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No matching tools found for "{query}"</p>
            </div>
          ) : (
            filtered.map((tool, idx) => (
              <div
                key={tool.id}
                onClick={() => {
                  navigate(tool.route);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  idx === selectedIndex ? 'bg-indigo-600/15 border border-indigo-500/30' : 'hover:bg-[#181b22] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${idx === selectedIndex ? 'bg-indigo-600 text-white' : 'bg-[#181b22] text-slate-300'}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100 text-sm">{tool.name}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold bg-[#181b22] text-indigo-300 border border-[#222631]">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{tool.description}</p>
                  </div>
                </div>
                <CornerDownLeft className={`w-4 h-4 ${idx === selectedIndex ? 'text-indigo-400' : 'text-slate-600'}`} />
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#0a0b0f] border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-[#181b22] rounded border border-[#222631]">↑↓</span>
            <span>Navigate</span>
            <span className="px-1.5 py-0.5 bg-[#181b22] rounded border border-[#222631] ml-2">↵</span>
            <span>Select</span>
            <span className="px-1.5 py-0.5 bg-[#181b22] rounded border border-[#222631] ml-2">ESC</span>
            <span>Close</span>
          </div>
          <span className="text-indigo-400 font-medium font-mono text-[11px]">bijeshsharam.com.np</span>
        </div>
      </div>
    </div>
  );
}
