import React, { useState } from 'react';
import { Globe, ShieldCheck, Clock, Server, AlertCircle, Sparkles } from 'lucide-react';

export default function UrlInspector({ onShowToast }) {
  const [url, setUrl] = useState('https://bijeshsharam.com.np');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const inspectUrl = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/tools/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Inspection failed');
      }

      setResult(json.data);
      if (onShowToast) onShowToast('URL inspection complete!');
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
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>
          <strong>Enterprise SSRF Guard:</strong> Inspection requests are sanitized and filtered to block private RFC1918 subnets, cloud metadata services, and internal endpoints.
        </span>
      </div>

      {/* Input */}
      <form onSubmit={inspectUrl} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Website Header & Meta Inspector</h3>
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
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Inspecting...' : 'Inspect Website'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
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
              <div className="text-base font-bold text-white mt-1 truncate">{result.headers.server}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Security (HSTS)</span>
              <div className="text-base font-bold text-cyan-400 mt-1 truncate">{result.headers.strictTransportSecurity !== 'Not set' ? 'Active' : 'Not set'}</div>
            </div>
          </div>

          {/* Extracted Metadata Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              Extracted Open Graph & SEO Metadata
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Page Title (&lt;title&gt;)</span>
                <span className="text-white font-bold">{result.metadata.title || 'None provided'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Description (&lt;meta name="description"&gt;)</span>
                <span className="text-slate-300">{result.metadata.description || 'None provided'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
