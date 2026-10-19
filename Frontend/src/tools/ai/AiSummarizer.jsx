import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, ListChecks, Clock, ArrowRight, Zap } from 'lucide-react';

const SAMPLE_TEXT = `Online utility platforms have grown increasingly popular among developers, students, and digital creators worldwide. By consolidating multiple utilities such as JSON formatters, regular expression testers, document converters, and calendar transformations into a single accessible portal, users can complete routine tasks without installing heavy native software or dealing with cluttered ad networks.

Modern web applications prioritize user privacy by executing calculations entirely in the client's browser using HTML5, Web Cryptography, and Canvas APIs. Furthermore, incorporating localized regional tools—such as Bikram Sambat calendar conversion and Nepali Devanagari typing—provides distinctive value in emerging technology ecosystems like Nepal. Businesses must ensure that all tax calculations comply with IRD regulations and that invoices clearly display VAT and PAN details. Digital transformation teams should schedule regular audits and prepare documentation for deployment.`;

export default function AiSummarizer({ onShowToast }) {
  const [content, setContent] = useState(SAMPLE_TEXT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [quota, setQuota] = useState({ dailyLimit: 20, remainingToday: 20 });
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'summarize',
          content
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Summarization request failed');
      }

      setResult(data.data);
      if (data.quota) setQuota(data.quota);
      if (onShowToast) onShowToast('Document summarized successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* AI Quota Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-slate-900 border border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-violet-300">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span><strong>AI Mini Tool:</strong> Fast semantic distillation and action item extraction.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Daily Free Requests:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">
            {quota.remainingToday} / {quota.dailyLimit} remaining
          </span>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" /> Enter Article, Notes or Document
          </span>
          <button
            onClick={() => setContent(SAMPLE_TEXT)}
            className="text-xs text-violet-400 hover:text-violet-300 underline"
          >
            Load Sample Text
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste long text, article, or research notes to summarize..."
          className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 h-44 resize-none focus:outline-none focus:border-violet-500 leading-relaxed"
        />

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSummarize}
            disabled={loading || !content.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Summary...' : 'Summarize Document'}</span>
          </button>
        </div>
      </div>

      {/* Summary Output */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block">
              Executive Summary
            </span>
            <p className="text-sm md:text-base font-medium text-white leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Core Key Takeaways
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.keyPoints.map((point, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4" /> Identified Action Items
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.actionItems.map((action, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
