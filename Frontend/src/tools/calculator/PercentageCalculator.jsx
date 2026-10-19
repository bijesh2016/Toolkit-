import React, { useState } from 'react';
import { Percent, ArrowRight, Sparkles } from 'lucide-react';

export default function PercentageCalculator({ onShowToast }) {
  // Case 1: What is X% of Y?
  const [c1Percent, setC1Percent] = useState('15');
  const [c1Total, setC1Total] = useState('2000');
  const res1 = (Number(c1Percent) * Number(c1Total)) / 100;

  // Case 2: X is what % of Y?
  const [c2Part, setC2Part] = useState('450');
  const [c2Total, setC2Total] = useState('1500');
  const res2 = Number(c2Total) ? ((Number(c2Part) / Number(c2Total)) * 100).toFixed(2) : 0;

  // Case 3: % Increase/Decrease from X to Y
  const [c3From, setC3From] = useState('1000');
  const [c3To, setC3To] = useState('1350');
  const diff3 = Number(c3To) - Number(c3From);
  const res3 = Number(c3From) ? ((diff3 / Number(c3From)) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Case 1 */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
          1. Calculate X% of a Value
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm text-slate-400">What is</span>
          <div className="relative w-28">
            <input
              type="number"
              value={c1Percent}
              onChange={e => setC1Percent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-xs">%</span>
          </div>
          <span className="text-sm text-slate-400">of</span>
          <input
            type="number"
            value={c1Total}
            onChange={e => setC1Total(e.target.value)}
            className="w-36 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-slate-400">=</span>
          <div className="p-2.5 px-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-base">
            {isNaN(res1) ? 0 : res1.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Case 2 */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
          2. What Percentage is X of Y?
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="number"
            value={c2Part}
            onChange={e => setC2Part(e.target.value)}
            className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-slate-400">is what % of</span>
          <input
            type="number"
            value={c2Total}
            onChange={e => setC2Total(e.target.value)}
            className="w-36 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-slate-400">=</span>
          <div className="p-2.5 px-4 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-bold text-base">
            {isNaN(res2) ? 0 : res2}%
          </div>
        </div>
      </div>

      {/* Case 3 */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
          3. Percentage Increase / Decrease
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm text-slate-400">From</span>
          <input
            type="number"
            value={c3From}
            onChange={e => setC3From(e.target.value)}
            className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-slate-400">to</span>
          <input
            type="number"
            value={c3To}
            onChange={e => setC3To(e.target.value)}
            className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-slate-400">=</span>
          <div className={`p-2.5 px-4 rounded-xl border font-bold text-base ${
            res3 >= 0
              ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-600/20 border-rose-500/30 text-rose-300'
          }`}>
            {res3 >= 0 ? `+${res3}% Increase` : `${res3}% Decrease`}
          </div>
        </div>
      </div>
    </div>
  );
}
