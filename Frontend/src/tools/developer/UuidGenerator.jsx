import React, { useState } from 'react';
import { Fingerprint, Copy, RefreshCw, Check } from 'lucide-react';

export default function UuidGenerator({ onShowToast }) {
  const [count, setCount] = useState(5);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState([]);

  const generateUuidV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      let id = generateUuidV4();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
    if (onShowToast) onShowToast(`Generated ${count} UUID(s)!`);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [count, hyphens, uppercase]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    if (onShowToast) onShowToast('Copied all UUIDs to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">UUID v4 & Random Token Generator</h3>
            <p className="text-xs text-slate-400">Cryptographically unique universally unique identifiers (RFC 4122)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Quantity ({count})</label>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={e => setHyphens(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>Include Hyphens (-)</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={e => setUppercase(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>UPPERCASE Format</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleGenerate}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
          <button
            onClick={handleCopyAll}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy All
          </button>
        </div>
      </div>

      {/* Generated Output */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
          Generated Identifiers ({uuids.length}):
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {uuids.map((id, index) => (
            <div
              key={index}
              onClick={() => {
                navigator.clipboard.writeText(id);
                if (onShowToast) onShowToast(`Copied ${id}`);
              }}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-xs font-mono text-cyan-300 cursor-pointer group transition-colors"
              title="Click to copy single UUID"
            >
              <span>{id}</span>
              <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
