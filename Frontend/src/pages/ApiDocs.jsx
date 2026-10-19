import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Server, CheckCircle2, AlertCircle, Copy, Terminal, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function ApiDocs({ onShowToast }) {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setHealthStatus(null);
        setLoading(false);
      });
  }, []);

  const sampleCurl = `curl -X POST http://localhost:5000/api/tools/inspect \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://bijeshsharam.com.np"}'`;

  const sampleBsToAd = `curl "http://localhost:5000/api/nepal/bs-to-ad?bsYear=2081&bsMonth=7&bsDay=1"`;

  const sampleTempMail = `curl -X POST http://localhost:5000/api/tools/temp-mail/create`;

  const handleCopy = (code) => {
    playClickSound();
    navigator.clipboard.writeText(code);
    if (onShowToast) onShowToast('Copied cURL command to clipboard!');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Swagger API & Developer Documentation
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              OpenAPI 3.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
            Integrate Bijesh Tools Hub microservices directly into your web applications, scripts, CLI tools, or automated backend workflows.
          </p>
        </div>

        <a
          href="http://localhost:5000/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all self-start md:self-auto shrink-0 relative z-10 cursor-pointer"
        >
          <span>Open Interactive Swagger UI</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Backend Status Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-white">Backend Microservices Status</h3>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                healthStatus?.status === 'online' 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {healthStatus?.status === 'online' ? 'Online' : 'Standby / Local'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Uptime: {healthStatus ? `${healthStatus.uptimeSeconds}s` : 'Connecting...'} • Version: 1.0.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> SSRF Protected
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-300 bg-[#181b22] px-2.5 py-1 rounded-lg border border-[#222631]">
            Port :5000
          </span>
        </div>
      </div>

      {/* Code Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Web Inspect */}
        <div className="p-6 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-indigo-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Web Inspect API (cURL)
            </span>
            <button onClick={() => handleCopy(sampleCurl)} className="hover:text-white text-slate-400 flex items-center gap-1 cursor-pointer">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#0a0b0f] font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed border border-[#222631]">
            {sampleCurl}
          </pre>
        </div>

        {/* Example 2: Nepal BS to AD */}
        <div className="p-6 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-rose-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Universal BS to AD (cURL)
            </span>
            <button onClick={() => handleCopy(sampleBsToAd)} className="hover:text-white text-slate-400 flex items-center gap-1 cursor-pointer">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#0a0b0f] font-mono text-xs text-rose-200 overflow-x-auto leading-relaxed border border-[#222631]">
            {sampleBsToAd}
          </pre>
        </div>
      </div>
    </div>
  );
}
