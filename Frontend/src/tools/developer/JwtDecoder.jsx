import React, { useState } from 'react';
import { Key, ShieldAlert, CheckCircle2, Clock, AlertTriangle, Copy, Trash2 } from 'lucide-react';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJpamVzaCBTaGFybWEiLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImRldkBiaWplc2hzaGFyYW0uY29tLm5wIiwiaWF0IjoxNzI5MTYwMDAwLCJleHAiOjE3NjA3MTYwMDB9.4PzN3_SampleSignatureDoNotUseInProd`;

export default function JwtDecoder({ onShowToast }) {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  const decodeJwt = (jwtString) => {
    setToken(jwtString);
    setError('');
    if (!jwtString.trim()) {
      setHeader(null);
      setPayload(null);
      return;
    }

    try {
      const parts = jwtString.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('A valid JWT must have 3 parts separated by dots (header.payload.signature).');
      }

      // Base64Url decode
      const b64UrlDecode = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(escape(window.atob(base64)));
      };

      const decodedHeader = JSON.parse(b64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(b64UrlDecode(parts[1]));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (err) {
      setError(err.message || 'Invalid JWT token');
      setHeader(null);
      setPayload(null);
    }
  };

  React.useEffect(() => {
    decodeJwt(SAMPLE_JWT);
  }, []);

  const getExpirationStatus = () => {
    if (!payload || !payload.exp) return null;
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = expDate < now;

    return {
      isExpired,
      dateString: expDate.toLocaleString(),
      relative: Math.abs(Math.round((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    };
  };

  const expStatus = getExpirationStatus();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
          <span><strong>Zero Retention:</strong> Tokens are decoded entirely inside your browser's JavaScript engine and never sent over the network.</span>
        </div>
        <button
          onClick={() => decodeJwt(SAMPLE_JWT)}
          className="text-xs text-indigo-400 hover:text-indigo-200 underline"
        >
          Reset to Sample
        </button>
      </div>

      {/* Input */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            Paste Encoded JWT
          </span>
          <button
            onClick={() => decodeJwt('')}
            className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          value={token}
          onChange={e => decodeJwt(e.target.value)}
          placeholder="Paste JWT string (eyJhbGciOi...)"
          className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-2xl border border-slate-800 h-28 resize-none focus:outline-none focus:border-indigo-500"
          spellCheck="false"
        />
        {error && (
          <div className="mt-2 text-rose-400 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Decoded Sections */}
      {header && payload && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Header Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-rose-400">
              <span>HEADER: ALGORITHM & TOKEN TYPE</span>
              <span className="font-mono text-slate-400">{header.alg || 'Unknown'}</span>
            </div>
            <pre className="mt-3 p-3 rounded-2xl bg-slate-950 font-mono text-xs text-rose-300 overflow-x-auto flex-1">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-indigo-400">
              <span>PAYLOAD: DATA & CLAIMS</span>
              {expStatus && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  expStatus.isExpired ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {expStatus.isExpired ? 'EXPIRED' : 'ACTIVE / VALID'}
                </span>
              )}
            </div>
            <pre className="mt-3 p-3 rounded-2xl bg-slate-950 font-mono text-xs text-indigo-200 overflow-x-auto flex-1">
              {JSON.stringify(payload, null, 2)}
            </pre>

            {/* Claims breakdown */}
            {expStatus && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Expiration (exp): <strong className="text-slate-200">{expStatus.dateString}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
