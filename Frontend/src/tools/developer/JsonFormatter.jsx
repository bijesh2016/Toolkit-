import React, { useState } from 'react';
import { FileCode2, Copy, Download, Trash2, Check, AlertCircle, Sparkles } from 'lucide-react';

const SAMPLE_JSON = `{
  "platform": "Bijesh Tools Hub",
  "website": "bijeshsharam.com.np",
  "founder": "Bijesh Sharma",
  "country": "Nepal",
  "currency": "NPR",
  "toolsCount": 50,
  "privacyFirst": true,
  "supportedCategories": [
    "Developer",
    "Nepal Suite",
    "Document & PDF",
    "Calculators",
    "AI Mini Tools"
  ]
}`;

export default function JsonFormatter({ onShowToast }) {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [outputJson, setOutputJson] = useState('');
  const [minifiedJson, setMinifiedJson] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [copiedMinified, setCopiedMinified] = useState(false);

  const formatJson = (indentSpaces = 2) => {
    setErrorInfo(null);
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSpaces);
      const minified = JSON.stringify(parsed);
      setOutputJson(formatted);
      setMinifiedJson(minified);

      const keysCount = (inputJson.match(/"[^"]+"\s*:/g) || []).length;
      const sizeBytes = new Blob([formatted]).size;
      const minifiedSize = new Blob([minified]).size;
      const savedPercent = Math.round(((sizeBytes - minifiedSize) / sizeBytes) * 100);
      setStats({
        keysCount,
        sizeBytes,
        minifiedSize,
        savedPercent: savedPercent > 0 ? savedPercent : 0,
        lines: formatted.split('\n').length
      });
      if (onShowToast) onShowToast('JSON formatted successfully!');
    } catch (err) {
      setErrorInfo(err.message);
      setOutputJson('');
      setMinifiedJson('');
      setStats(null);
    }
  };

  const minifyJson = () => {
    setErrorInfo(null);
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setMinifiedJson(minified);

      const originalSize = new Blob([inputJson]).size;
      const minifiedSize = new Blob([minified]).size;
      const savedPercent = Math.round(((originalSize - minifiedSize) / originalSize) * 100);

      setStats({
        keysCount: (inputJson.match(/"[^"]+"\s*:/g) || []).length,
        sizeBytes: minifiedSize,
        minifiedSize,
        savedPercent: savedPercent > 0 ? savedPercent : 0,
        lines: 1
      });
      if (onShowToast) onShowToast(`Minified! Reduced size by ${savedPercent > 0 ? savedPercent : 0}%`);
    } catch (err) {
      setErrorInfo(err.message);
      setOutputJson('');
      setMinifiedJson('');
      setStats(null);
    }
  };

  const handleCopy = () => {
    if (!outputJson && !inputJson) return;
    navigator.clipboard.writeText(outputJson || inputJson);
    if (onShowToast) onShowToast('Copied JSON to clipboard!');
  };

  const handleCopyMinified = () => {
    let min = minifiedJson;
    if (!min) {
      try {
        min = JSON.stringify(JSON.parse(inputJson));
        setMinifiedJson(min);
      } catch {
        if (onShowToast) onShowToast('Invalid JSON — fix errors first.');
        return;
      }
    }
    navigator.clipboard.writeText(min);
    setCopiedMinified(true);
    setTimeout(() => setCopiedMinified(false), 1800);
    if (onShowToast) onShowToast('Copied minified JSON!');
  };

  const handleDownload = () => {
    const content = outputJson || inputJson;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-data.json';
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Downloaded .json file!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            Beautify (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Beautify (4 Spaces)
          </button>
          <button
            onClick={minifyJson}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Minify JSON
          </button>
          <button
            onClick={handleCopyMinified}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copiedMinified
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Copy minified (single-line) JSON"
          >
            {copiedMinified ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Minified
          </button>
          <button
            onClick={() => { setInputJson(SAMPLE_JSON); setOutputJson(''); setMinifiedJson(''); setErrorInfo(null); setStats(null); }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            Load Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy to Clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setInputJson(''); setOutputJson(''); setMinifiedJson(''); setErrorInfo(null); setStats(null); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <span>Keys: <strong className="text-slate-200">{stats.keysCount}</strong></span>
          <span>Lines: <strong className="text-slate-200">{stats.lines}</strong></span>
          <span>Size: <strong className="text-slate-200">{stats.sizeBytes} bytes</strong></span>
          {stats.minifiedSize && stats.minifiedSize !== stats.sizeBytes && (
            <span>Minified: <strong className="text-emerald-400">{stats.minifiedSize} bytes</strong></span>
          )}
          {stats.savedPercent > 0 && (
            <span className="text-emerald-400 font-semibold">↓ {stats.savedPercent}% smaller minified</span>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorInfo && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>
            <strong className="font-semibold">Invalid JSON: </strong>
            <span>{errorInfo}</span>
          </div>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col h-96 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Raw Input JSON</span>
            <span>{inputJson.length} chars</span>
          </div>
          <textarea
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
            placeholder="Paste your JSON string here..."
            className="flex-1 w-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col h-96 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">Formatted Output</span>
            {stats && (
              <span className="text-emerald-400 font-mono text-[11px]">
                {stats.lines} lines • {stats.sizeBytes} bytes
              </span>
            )}
          </div>
          <textarea
            readOnly
            value={outputJson || (errorInfo ? 'Syntax error in JSON input.' : 'Formatted JSON will appear here... Click Beautify.')}
            className="flex-1 w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
