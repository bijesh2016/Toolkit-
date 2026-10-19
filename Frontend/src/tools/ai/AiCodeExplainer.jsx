import React, { useState } from 'react';
import { Cpu, Bug, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const SAMPLE_CODE = `function findDuplicateNumbers(arr) {
  const seen = new Set();
  const duplicates = [];
  for (let num of arr) {
    if (seen.has(num)) {
      duplicates.push(num);
    } else {
      seen.add(num);
    }
  }
  return duplicates;
}`;

const SAMPLE_ERROR = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (c:/projects/tools-hub/src/UserList.jsx:14:22)
    at renderWithHooks (react-dom.development.js:14985:18)`;

export default function AiCodeExplainer({ onShowToast }) {
  const [mode, setMode] = useState('code'); // 'code' or 'error'
  const [content, setContent] = useState(SAMPLE_CODE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleExplain = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: mode === 'code' ? 'code-explain' : 'error-explain',
          content
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI analysis failed');
      }

      setResult(data.data);
      if (onShowToast) onShowToast('Analysis generated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setContent(m === 'code' ? SAMPLE_CODE : SAMPLE_ERROR);
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto">
        <button
          onClick={() => switchMode('code')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Explain Code
        </button>
        <button
          onClick={() => switchMode('error')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'error' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Diagnose Error
        </button>
      </div>

      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            {mode === 'code' ? <Cpu className="w-4 h-4 text-indigo-400" /> : <Bug className="w-4 h-4 text-rose-400" />}
            {mode === 'code' ? 'Paste Code Snippet' : 'Paste Runtime Error / Stack Trace'}
          </span>
          <button
            onClick={() => setContent(mode === 'code' ? SAMPLE_CODE : SAMPLE_ERROR)}
            className="text-indigo-400 hover:underline"
          >
            Reset Sample
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={mode === 'code' ? 'Paste code here...' : 'Paste stack trace or error log here...'}
          className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 font-mono text-xs text-indigo-200 h-40 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
          spellCheck="false"
        />

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleExplain}
            disabled={loading || !content.trim()}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : mode === 'code' ? 'Explain Code' : 'Diagnose Root Cause'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {mode === 'code' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Detected Language</span>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{result.detectedLanguage}</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Estimated Algorithmic Complexity</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{result.estimatedComplexity}</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Structural Breakdown</h4>
                <div className="space-y-2 text-xs">
                  {result.keyComponents.map((comp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-indigo-300 font-semibold">{comp.section}: </strong>
                      <span className="text-slate-300">{comp.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400 pb-3 border-b border-slate-800">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold text-sm">Diagnosis: {result.errorCategory}</h4>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-500 block mb-1">Recommended Fix:</span>
                <p className="text-emerald-300 font-semibold">{result.suggestedFix}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold block">Resolution Steps:</span>
                {result.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">{i + 1}.</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
