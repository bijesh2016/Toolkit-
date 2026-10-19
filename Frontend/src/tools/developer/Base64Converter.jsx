import React, { useState } from 'react';
import { Binary, ArrowRightLeft, Copy, Trash2, Check } from 'lucide-react';

export default function Base64Converter({ onShowToast }) {
  const [conversionType, setConversionType] = useState('base64'); // 'base64', 'url', 'hex', 'html'
  const [direction, setDirection] = useState('encode'); // 'encode' or 'decode'
  const [inputVal, setInputVal] = useState('Hello from Bijesh Tools Hub (नेपाल)!');
  const [outputVal, setOutputVal] = useState('');
  const [error, setError] = useState('');

  const processConversion = (text, type, dir) => {
    setError('');
    if (!text) {
      setOutputVal('');
      return;
    }

    try {
      if (type === 'base64') {
        if (dir === 'encode') {
          // UTF-8 safe base64 encoding
          const encoded = window.btoa(unescape(encodeURIComponent(text)));
          setOutputVal(encoded);
        } else {
          // UTF-8 safe base64 decoding
          const decoded = decodeURIComponent(escape(window.atob(text.trim())));
          setOutputVal(decoded);
        }
      } else if (type === 'url') {
        if (dir === 'encode') {
          setOutputVal(encodeURIComponent(text));
        } else {
          setOutputVal(decodeURIComponent(text));
        }
      } else if (type === 'hex') {
        if (dir === 'encode') {
          let hex = '';
          for (let i = 0; i < text.length; i++) {
            hex += text.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
          }
          setOutputVal(hex.trim());
        } else {
          const cleanHex = text.replace(/\s+/g, '');
          let str = '';
          for (let i = 0; i < cleanHex.length; i += 2) {
            str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
          }
          setOutputVal(str);
        }
      } else if (type === 'html') {
        if (dir === 'encode') {
          const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
          setOutputVal(text.replace(/[&<>"']/g, m => map[m]));
        } else {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          setOutputVal(doc.documentElement.textContent || '');
        }
      }
    } catch (err) {
      setError(err.message || 'Conversion failed. Please verify input data.');
      setOutputVal('');
    }
  };

  React.useEffect(() => {
    processConversion(inputVal, conversionType, direction);
  }, [inputVal, conversionType, direction]);

  const handleSwap = () => {
    setInputVal(outputVal);
    setDirection(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    if (onShowToast) onShowToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Type Switcher & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {[
            { id: 'base64', label: 'Base64' },
            { id: 'url', label: 'URL Encoding' },
            { id: 'hex', label: 'Hexadecimal' },
            { id: 'html', label: 'HTML Entities' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setConversionType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                conversionType === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection('encode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              direction === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setDirection('decode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              direction === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Decode
          </button>
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Input ({direction.toUpperCase()})</span>
            <button onClick={() => setInputVal('')} className="hover:text-rose-400 text-slate-500">Clear</button>
          </div>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Enter text to convert..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none"
          />
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">Converted Output</span>
            <button
              onClick={handleCopy}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            readOnly
            value={outputVal}
            placeholder="Result will appear here..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
