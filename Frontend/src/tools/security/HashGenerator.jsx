import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Sparkles } from 'lucide-react';

export default function HashGenerator({ onShowToast }) {
  const [text, setText] = useState('Bijesh Tools Hub - Secure Online Utilities');
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '' });
  const [loading, setLoading] = useState(false);

  const calculateHashes = async (inputStr) => {
    if (!inputStr) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    try {
      // Use Backend API for comprehensive MD5, SHA1, SHA256, SHA512
      const res = await fetch('/api/tools/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputStr })
      });
      const data = await res.json();
      if (data.success) {
        setHashes(data.data);
      }
    } catch (e) {
      // Web Crypto API fallback for SHA-256
      try {
        const msgUint8 = new TextEncoder().encode(inputStr);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHashes(prev => ({ ...prev, sha256: hashHex }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    calculateHashes(text);
  }, [text]);

  const handleCopy = (hashVal, algo) => {
    navigator.clipboard.writeText(hashVal);
    if (onShowToast) onShowToast(`Copied ${algo} hash to clipboard!`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Hash className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Hash & Checksum Generator</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Input Text String</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste any text to hash..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-sm text-white font-mono h-24 resize-none focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Hashes List */}
      <div className="space-y-3">
        {[
          { algo: 'SHA-256', val: hashes.sha256, color: 'text-indigo-400' },
          { algo: 'MD5', val: hashes.md5, color: 'text-cyan-400' },
          { algo: 'SHA-1', val: hashes.sha1, color: 'text-amber-400' },
          { algo: 'SHA-512', val: hashes.sha512, color: 'text-emerald-400' }
        ].map(item => (
          <div key={item.algo} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${item.color}`}>
                {item.algo}
              </span>
              <div className="font-mono text-xs text-slate-300 break-all select-all">
                {item.val || 'Computing...'}
              </div>
            </div>

            <button
              onClick={() => handleCopy(item.val, item.algo)}
              disabled={!item.val}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Copy Hash"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
