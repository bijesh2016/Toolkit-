import React, { useState } from 'react';
import { Globe, ShieldCheck, Clock, Server, AlertCircle, Sparkles, ExternalLink, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function UrlInspector({ onShowToast }) {
  const [url, setUrl] = useState('https://bijeshsharam.com.np');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sampleUrls = [
    { name: 'Bijesh Sharma', url: 'https://bijeshsharam.com.np' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Wikipedia', url: 'https://wikipedia.org' },
    { name: 'Google', url: 'https://google.com' }
  ];

  const inspectUrl = async (targetUrl = url, e) => {
    if (e) e.preventDefault();
    if (!targetUrl || !targetUrl.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/tools/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Inspection failed. Please check the domain name or network status.');
      }

      setResult(json.data);
      if (onShowToast) onShowToast('Website inspection completed successfully!');
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* SSRF Protection Notice */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            <strong>Enterprise SSRF Guard:</strong> Inspection requests are sanitized and filtered to block private RFC1918 subnets, cloud metadata services, and internal endpoints.
          </span>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-indigo-600/20 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
          Zero Leak
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => inspectUrl(url, e)} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Website Header & Security Inspector</h3>
          </div>
          <span className="text-xs text-slate-400">HTTP/1.1 & HTTP/2 Audit</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Inspecting...' : 'Inspect Website'}
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500">Quick Test:</span>
          {sampleUrls.map(item => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setUrl(item.url);
                inspectUrl(item.url);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">{error}</span>
              <span className="text-[11px] text-slate-400 block">
                Note: In sandboxed or offline environments without active external network routing, external domains cannot be resolved.
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">HTTP Status</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{result.statusCode} {result.statusText}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Latency</span>
              <div className="text-xl font-bold text-indigo-400 mt-1">{result.responseTimeMs} ms</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Server</span>
              <div className="text-base font-bold text-white mt-1 truncate">{result.headers.server || 'Cloudflare / Edge'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Security (HSTS)</span>
              <div className="text-base font-bold text-cyan-400 mt-1 truncate">
                {result.headers.strictTransportSecurity !== 'Not set' ? 'Active' : 'Not set'}
              </div>
            </div>
          </div>

          {/* Security Headers Audit */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Security Headers Audit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Strict-Transport-Security (HSTS)</div>
                  <div className="font-mono text-slate-200 mt-0.5 truncate">{result.headers.strictTransportSecurity}</div>
                </div>
                {result.headers.strictTransportSecurity !== 'Not set' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Content-Security-Policy (CSP)</div>
                  <div className="font-mono text-slate-200 mt-0.5 truncate">{result.headers.contentSecurityPolicy}</div>
                </div>
                {result.headers.contentSecurityPolicy !== 'Not set' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">X-Frame-Options</div>
                  <div className="font-mono text-slate-200 mt-0.5 truncate">{result.headers.xFrameOptions}</div>
                </div>
                {result.headers.xFrameOptions !== 'Not set' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Cache-Control</div>
                  <div className="font-mono text-slate-200 mt-0.5 truncate">{result.headers.cacheControl}</div>
                </div>
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Extracted Metadata Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              Extracted Open Graph & SEO Metadata
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Page Title (&lt;title&gt;)</span>
                <span className="text-white font-bold">{result.metadata.title || 'None provided'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Description (&lt;meta name="description"&gt;)</span>
                <span className="text-slate-300">{result.metadata.description || 'None provided'}</span>
              </div>
              {result.metadata.canonical && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Canonical URL</span>
                  <span className="font-mono text-slate-300">{result.metadata.canonical}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
