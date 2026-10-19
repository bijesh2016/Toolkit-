import React, { useState } from 'react';
import { FileCode, Download, Copy, Sparkles } from 'lucide-react';

export default function RobotsSitemapGenerator({ onShowToast }) {
  const [tab, setTab] = useState('robots'); // 'robots' or 'sitemap'

  // Robots config
  const [domain, setDomain] = useState('https://bijeshsharam.com.np');
  const [disallowPaths, setDisallowPaths] = useState('/admin/\n/api/\n/private/');
  const [allowPaths, setAllowPaths] = useState('/public/\n/tools/');

  // Sitemap config
  const [sitemapUrls, setSitemapUrls] = useState([
    { path: '/', priority: '1.0', freq: 'daily' },
    { path: '/tools/bs-ad-converter', priority: '0.9', freq: 'weekly' },
    { path: '/tools/nepali-unicode', priority: '0.9', freq: 'weekly' },
    { path: '/tools/language-translator', priority: '0.9', freq: 'weekly' },
    { path: '/tools/json-formatter', priority: '0.8', freq: 'monthly' }
  ]);

  const robotsContent = `User-agent: *
${disallowPaths.split('\n').filter(Boolean).map(p => `Disallow: ${p.trim()}`).join('\n')}
${allowPaths.split('\n').filter(Boolean).map(p => `Allow: ${p.trim()}`).join('\n')}

Sitemap: ${domain}/sitemap.xml`;

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${domain}${u.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const handleDownload = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast(`Downloaded ${filename}!`);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    if (onShowToast) onShowToast('Copied content to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setTab('robots')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'robots' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Robots.txt Generator
        </button>
        <button
          onClick={() => setTab('sitemap')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'sitemap' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          XML Sitemap Generator
        </button>
      </div>

      {tab === 'robots' ? (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white">Configure Robots.txt Directives</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(robotsContent)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownload('robots.txt', robotsContent)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download robots.txt
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Website Domain URL</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Disallowed Paths (One per line)</label>
              <textarea
                value={disallowPaths}
                onChange={e => setDisallowPaths(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white h-28 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Allowed Paths (One per line)</label>
              <textarea
                value={allowPaths}
                onChange={e => setAllowPaths(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white h-28 resize-none"
              />
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {robotsContent}
          </pre>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white">XML Sitemap Structure</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(sitemapContent)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownload('sitemap.xml', sitemapContent)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download sitemap.xml
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
            {sitemapContent}
          </pre>
        </div>
      )}
    </div>
  );
}
