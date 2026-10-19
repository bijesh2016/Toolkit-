import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, Sparkles, Trash2 } from 'lucide-react';

const SAMPLE_LOG = `2026-10-17 12:00:00 [ERROR] AWS upload failed with key AKIA1234567890ABCDEF
Contact support at security-team@company.com
Client session: ghp_1234567890abcdefghijklmnopqrstuvwxyzAB
Card ending in: 4532-1234-5678-9010
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotShareThisSecret`;

export default function SecretRedactor({ onShowToast }) {
  const [inputText, setInputText] = useState(SAMPLE_LOG);
  const [redactedText, setRedactedText] = useState('');
  const [findings, setFindings] = useState([]);

  const scanAndRedact = (raw) => {
    setInputText(raw);
    if (!raw) {
      setRedactedText('');
      setFindings([]);
      return;
    }

    const detected = [];
    let clean = raw;

    // AWS Access Key ID
    const awsRegex = /(AKIA[0-9A-Z]{16})/g;
    let m;
    while ((m = awsRegex.exec(raw)) !== null) {
      detected.push({ type: 'AWS Access Key', match: m[1] });
    }
    clean = clean.replace(awsRegex, '[REDACTED_AWS_KEY]');

    // GitHub PAT
    const ghRegex = /(gh[pousr]_[A-Za-z0-9_]{36,255})/g;
    while ((m = ghRegex.exec(raw)) !== null) {
      detected.push({ type: 'GitHub Token', match: m[1] });
    }
    clean = clean.replace(ghRegex, '[REDACTED_GITHUB_TOKEN]');

    // Credit Card numbers
    const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
    while ((m = ccRegex.exec(raw)) !== null) {
      detected.push({ type: 'Credit Card', match: m[0] });
    }
    clean = clean.replace(ccRegex, '[REDACTED_CREDIT_CARD]');

    // Email
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    while ((m = emailRegex.exec(raw)) !== null) {
      detected.push({ type: 'Email Address', match: m[1] });
    }
    clean = clean.replace(emailRegex, '[REDACTED_EMAIL]');

    // JWT
    const jwtRegex = /(eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+)/g;
    while ((m = jwtRegex.exec(raw)) !== null) {
      detected.push({ type: 'JWT Token', match: m[1] });
    }
    clean = clean.replace(jwtRegex, '[REDACTED_JWT_TOKEN]');

    setFindings(detected);
    setRedactedText(clean);
  };

  React.useEffect(() => {
    scanAndRedact(SAMPLE_LOG);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(redactedText);
    if (onShowToast) onShowToast('Copied sanitized text to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            <strong>Local Privacy Scanner:</strong> Scans logs and code snippets to mask AWS keys, tokens, emails, and cards before sharing publicly or pasting into AI chats.
          </span>
        </div>
        <button
          onClick={() => scanAndRedact(SAMPLE_LOG)}
          className="text-xs text-indigo-400 hover:text-indigo-200 underline shrink-0"
        >
          Reset Sample
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Raw Input (Contains Secrets)</span>
            <button onClick={() => scanAndRedact('')} className="hover:text-rose-400 text-slate-500">Clear</button>
          </div>
          <textarea
            value={inputText}
            onChange={e => scanAndRedact(e.target.value)}
            className="flex-1 w-full bg-transparent font-mono text-xs text-rose-300 resize-none focus:outline-none leading-relaxed"
            spellCheck="false"
          />
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">Sanitized & Redacted Output</span>
            <button
              onClick={handleCopy}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Clean Text
            </button>
          </div>
          <textarea
            readOnly
            value={redactedText}
            className="flex-1 w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none leading-relaxed"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Detected Secrets Count */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="text-xs font-semibold text-slate-300 pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
          <span>Detected Sensitive Items ({findings.length}):</span>
          <span className="text-emerald-400 font-bold">100% Masked in Output</span>
        </div>

        {findings.length === 0 ? (
          <div className="text-xs text-slate-500 py-2">No sensitive credentials detected.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {findings.map((f, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-300 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>{f.type}:</span>
                <span className="text-slate-500">***{f.match.slice(-4)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
