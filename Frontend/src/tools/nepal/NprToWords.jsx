import React, { useState } from 'react';
import { Coins, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { convertToNprWords } from '../../../../Backend/src/utils/numberToWords.js';

export default function NprToWords({ onShowToast }) {
  const [amount, setAmount] = useState('125000');
  const [result, setResult] = useState(() => convertToNprWords(125000));

  const handleCalculate = (val) => {
    setAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setResult(convertToNprWords(parsed));
    } else {
      setResult(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast('Copied to clipboard!');
  };

  const presets = [
    { label: '50 Thousand', val: '50000' },
    { label: '1 Lakh', val: '100000' },
    { label: '5.5 Lakhs', val: '550000' },
    { label: '25 Lakhs', val: '2500000' },
    { label: '1 Crore', val: '10000000' }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Input Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">NPR Amount to Words Converter</h3>
            <p className="text-xs text-slate-400">South Asian numbering system (Crore, Lakh, Thousand) & Devanagari</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Enter Amount in Nepali Rupees (NPR / रू)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">NPR</span>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={e => handleCalculate(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-16 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-500">Quick Presets:</span>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => handleCalculate(p.val)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Cards */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* English Words Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Words (English - South Asian Format)</span>
              <button
                onClick={() => handleCopy(result.english)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy text"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-lg md:text-xl font-bold text-indigo-300 leading-snug">
              {result.english}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Formatted: {result.formattedCurrency}
            </div>
          </div>

          {/* Nepali Devanagari Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-rose-950/30 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">अक्षरेपी (नेपाली भाषामा)</span>
              <button
                onClick={() => handleCopy(result.nepali)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy text"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-devanagari leading-snug">
              {result.nepali}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              बैंक चेक र आधिकारिक बिल तथा रसिदको लागि मान्य
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
