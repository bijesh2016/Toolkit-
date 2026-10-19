import React, { useState } from 'react';
import { Link, Copy, Check } from 'lucide-react';

export default function SlugGenerator({ onShowToast }) {
  const [title, setTitle] = useState('Top 10 Developer Tools in Nepal For 2026!');
  const [separator, setSeparator] = useState('-');
  const [isLower, setIsLower] = useState(true);

  const generateSlug = (str) => {
    let slug = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-zA-Z0-9\s-]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, separator);

    if (isLower) slug = slug.toLowerCase();
    return slug;
  };

  const slug = generateSlug(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    if (onShowToast) onShowToast('Copied URL slug to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Link className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">SEO Friendly URL Slug Generator</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Page Title / Article Headline</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Separator:</span>
            <select
              value={separator}
              onChange={e => setSeparator(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isLower}
              onChange={e => setIsLower(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Force Lowercase</span>
          </label>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span className="font-semibold text-indigo-400">Generated URL Slug</span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-300 break-all">
          {slug || 'your-slug-here'}
        </div>
        <div className="text-[11px] text-slate-500">
          Preview: https://bijeshsharam.com.np/posts/<span className="text-slate-300">{slug}</span>
        </div>
      </div>
    </div>
  );
}
