import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Copy, Sparkles } from 'lucide-react';

export default function TimestampConverter({ onShowToast }) {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState(true);

  // Conversion inputs
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Compute date from epoch
  const getParsedEpoch = () => {
    const num = Number(inputEpoch);
    if (isNaN(num)) return null;
    const ms = num < 10000000000 ? num * 1000 : num; // Handle seconds vs milliseconds
    const date = new Date(ms);
    if (isNaN(date.getTime())) return null;

    // Nepal Time is UTC + 5:45
    const nptTime = new Date(ms + (5 * 60 + 45) * 60 * 1000);

    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      nepalTime: `${nptTime.toUTCString().replace('GMT', 'NPT (UTC+5:45)')}`
    };
  };

  const parsed = getParsedEpoch();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast('Copied timestamp to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live Current Epoch Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Current Unix Timestamp
          </span>
          <div className="text-3xl md:text-4xl font-mono font-black text-white mt-1">
            {currentTimestamp}
          </div>
          <p className="text-xs text-slate-400 mt-1">Seconds since Jan 01, 1970 (UTC)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title={isLive ? 'Pause Clock' : 'Resume Clock'}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleCopy(String(currentTimestamp))}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Epoch
          </button>
        </div>
      </div>

      {/* Epoch to Date */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-white">Convert Epoch Timestamp ➔ Human Date</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={inputEpoch}
            onChange={e => setInputEpoch(e.target.value)}
            placeholder="Enter seconds or milliseconds (e.g. 1729160000)"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => setInputEpoch(String(currentTimestamp))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Use Now
          </button>
        </div>

        {parsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Local Time:</span>
              <span className="text-indigo-300 font-bold">{parsed.local}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Nepal Time (NPT UTC+5:45):</span>
              <span className="text-rose-300 font-bold">{parsed.nepalTime}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
              <span className="text-slate-500 block mb-1">UTC / ISO 8601:</span>
              <span className="text-emerald-300 font-bold">{parsed.iso}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
