import React, { useState } from 'react';
import { GitCompare, Sparkles } from 'lucide-react';
import { diffLines } from 'diff';

const ORIGINAL_SAMPLE = `function calculateTotal(price, taxRate) {
  const tax = price * taxRate;
  return price + tax;
}`;

const MODIFIED_SAMPLE = `function calculateTotal(price, taxRate, discount = 0) {
  const discountedPrice = Math.max(0, price - discount);
  const tax = discountedPrice * taxRate;
  return discountedPrice + tax;
}`;

export default function TextDiff({ onShowToast }) {
  const [original, setOriginal] = useState(ORIGINAL_SAMPLE);
  const [modified, setModified] = useState(MODIFIED_SAMPLE);

  const diffResult = diffLines(original, modified);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-64">
          <span className="text-xs font-semibold text-slate-400 mb-2">Original Text (Before)</span>
          <textarea
            value={original}
            onChange={e => setOriginal(e.target.value)}
            className="flex-1 w-full bg-slate-950 p-3 rounded-2xl font-mono text-xs text-slate-200 border border-slate-800 resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-64">
          <span className="text-xs font-semibold text-indigo-400 mb-2">Modified Text (After)</span>
          <textarea
            value={modified}
            onChange={e => setModified(e.target.value)}
            className="flex-1 w-full bg-slate-950 p-3 rounded-2xl font-mono text-xs text-slate-200 border border-slate-800 resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Visual Diff View */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-400" />
            Line-by-Line Difference Comparison
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Added</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Removed</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto space-y-0.5 leading-relaxed">
          {diffResult.map((part, index) => {
            const color = part.added
              ? 'bg-emerald-950/60 text-emerald-300 border-l-2 border-emerald-500 pl-2'
              : part.removed
              ? 'bg-rose-950/60 text-rose-300 border-l-2 border-rose-500 pl-2'
              : 'text-slate-400 pl-2.5';
            const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

            return (
              <div key={index} className={`whitespace-pre-wrap py-0.5 ${color}`}>
                {part.value.split('\n').filter(Boolean).map((line, lIdx) => (
                  <div key={lIdx}>{prefix}{line}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
