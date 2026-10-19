import React, { useState } from 'react';
import { FileText, Clock, Mic, AlignLeft, Copy, Trash2 } from 'lucide-react';

export default function WordCounter({ onShowToast }) {
  const [text, setText] = useState('Welcome to Bijesh Tools Hub! This free online utility counts words, characters, sentences, paragraphs, and estimates reading and speaking times instantly.');

  const wordsArray = text.trim() ? text.trim().split(/\s+/) : [];
  const wordsCount = wordsArray.length;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s+/g, '').length;
  const sentencesCount = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g) || []).length || 1 : 0;
  const paragraphsCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading time (approx 200 words per minute)
  const readingTimeMin = Math.ceil(wordsCount / 200);
  // Speaking time (approx 130 words per minute)
  const speakingTimeMin = Math.ceil(wordsCount / 130);

  // Keyword frequency
  const getKeywordFrequency = () => {
    if (wordsArray.length === 0) return [];
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'to', 'in', 'for', 'of', 'this', 'that', 'with']);
    const freq = {};
    wordsArray.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (clean && clean.length > 2 && !stopWords.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  };

  const topKeywords = getKeywordFrequency();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    if (onShowToast) onShowToast('Copied text to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium">Total Words</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{wordsCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium">Characters</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">{charsWithSpaces}</div>
          <span className="text-[10px] text-slate-500">{charsWithoutSpaces} no spaces</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium">Sentences</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{sentencesCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium">Paragraphs</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{paragraphsCount}</div>
        </div>
      </div>

      {/* Editor Box */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Enter or Paste Text
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy Text"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
          className="flex-1 w-full bg-transparent text-slate-100 resize-none focus:outline-none text-sm leading-relaxed"
        />

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Reading time: <strong className="text-slate-200">{readingTimeMin} min</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-indigo-400" /> Speaking time: <strong className="text-slate-200">{speakingTimeMin} min</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Keyword Density */}
      {topKeywords.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2.5">Top Frequent Keywords:</div>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(([kw, count]) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <span>{kw}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
