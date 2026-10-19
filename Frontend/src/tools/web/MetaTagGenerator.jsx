import React, { useState } from 'react';
import { Share2, Globe, Copy, Check, Eye } from 'lucide-react';

export default function MetaTagGenerator({ onShowToast }) {
  const [title, setTitle] = useState('Bijesh Tools Hub - 50+ Free Modern Online Utilities');
  const [description, setDescription] = useState('Free personal-branded online tools platform by Bijesh Sharma for developers, students, and businesses in Nepal and worldwide.');
  const [url, setUrl] = useState('https://bijeshsharam.com.np');
  const [imageUrl, setImageUrl] = useState('https://bijeshsharam.com.np/og-image.png');
  const [siteName, setSiteName] = useState('Bijesh Tools Hub');

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    if (onShowToast) onShowToast('Copied HTML meta tags to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Meta & OpenGraph Details</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Page Title</span>
              <span className={title.length > 60 ? 'text-amber-400' : 'text-slate-500'}>
                {title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Meta Description</span>
              <span className={description.length > 160 ? 'text-amber-400' : 'text-slate-500'}>
                {description.length}/160 chars
              </span>
            </div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Canonical URL</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Social Preview Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Live Previews */}
        <div className="space-y-4">
          {/* Google SERP Preview */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Google Search Preview
            </span>
            <div className="text-xs text-slate-400 truncate">{url}</div>
            <div className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer truncate">
              {title}
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Social Card Preview */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Twitter / Facebook Share Card
            </span>
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
              <div className="h-32 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                <span>OG Image: {imageUrl}</span>
              </div>
              <div className="p-3">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">{new URL(url || 'https://domain.com').hostname}</span>
                <div className="font-bold text-xs text-white truncate mt-0.5">{title}</div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-indigo-400">Ready-to-Use HTML Meta Tags</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
        </div>
        <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-200 font-mono text-xs overflow-x-auto leading-relaxed">
          {generatedHtml}
        </pre>
      </div>
    </div>
  );
}
