import React, { useState } from 'react';
import { Type, Copy, Trash2, Sparkles, Check } from 'lucide-react';

export default function CaseConverter({ onShowToast }) {
  const [text, setText] = useState('Build Modern, High-Performance Web Tools With Bijesh Sharma');

  const transform = (type) => {
    if (!text) return;
    let result = text;

    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '_');
        break;
      case 'kebab':
        result = text
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '-');
        break;
      case 'clean-spaces':
        result = text.replace(/\s+/g, ' ').trim();
        break;
      case 'remove-dups':
        const lines = text.split('\n');
        result = Array.from(new Set(lines)).join('\n');
        break;
      default:
        break;
    }

    setText(result);
    if (onShowToast) onShowToast(`Applied ${type} transform!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast('Copied text to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Transformation Buttons */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => transform('upper')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => transform('lower')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          lowercase
        </button>
        <button
          onClick={() => transform('title')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          Title Case
        </button>
        <button
          onClick={() => transform('sentence')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          Sentence case
        </button>
        <button
          onClick={() => transform('camel')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          camelCase
        </button>
        <button
          onClick={() => transform('kebab')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          kebab-case
        </button>
        <button
          onClick={() => transform('snake')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors"
        >
          snake_case
        </button>
        <button
          onClick={() => transform('clean-spaces')}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-colors"
        >
          Clean Extra Spaces
        </button>
      </div>

      {/* Text Area */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            Editable Text Area
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy text"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type text here to convert..."
          className="flex-1 w-full bg-transparent text-slate-100 text-sm resize-none focus:outline-none leading-relaxed"
        />

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>{text.length} characters</span>
          <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>
    </div>
  );
}
