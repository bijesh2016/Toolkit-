import React, { useState } from 'react';
import { Coins, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { convertToNprWords } from '../../utils/numberToWords';

export default function NprToWords({ onShowToast }) {
  const [amount, setAmount] = useState('125000');
  const [result, setResult] = useState(() => convertToNprWords(125000));
  const [copiedType, setCopiedType] = useState(null);

  const handleCalculate = async (val) => {
    setAmount(val);
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      setResult(null);
      return;
    }

    // Direct client computation for instantaneous feedback
    const localResult = convertToNprWords(parsed);
    setResult(localResult);

    // Also attempt backend API call asynchronously for full-stack integration
    try {
      const res = await fetch('/api/nepal/npr-to-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsed })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        }
      }
    } catch {
      // Retain localResult on network failure
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    if (onShowToast) onShowToast('Copied to clipboard!');
    setTimeout(() => setCopiedType(null), 2000);
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
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
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                English (South Asian System)
              </span>
              <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {result.english}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-500 font-mono">{result.formattedCurrency}</span>
              <button
                onClick={() => handleCopy(result.english, 'english')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                {copiedType === 'english' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'english' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Nepali Devanagari Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                नेपाली अक्षरेपी (Devanagari)
              </span>
              <div className="text-base sm:text-lg font-bold text-amber-300 leading-relaxed font-sans">
                {result.nepali}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-500">चेक तथा आधिकारिक भौचरका लागि</span>
              <button
                onClick={() => handleCopy(result.nepali, 'nepali')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                {copiedType === 'nepali' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'nepali' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
