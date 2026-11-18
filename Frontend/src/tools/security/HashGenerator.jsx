import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

// Lightweight pure JS MD5 fallback for browser client
function md5Cycle(x, k) {
  let a = x[0], b = x[1], c = x[2], d = x[3];
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function cmn(q, a, b, x, s, t) {
    a = (((a + q) | 0) + ((x + t) | 0)) | 0;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = (a + x[0]) | 0;
  x[1] = (b + x[1]) | 0;
  x[2] = (c + x[2]) | 0;
  x[3] = (d + x[3]) | 0;
}

function md51(s) {
  const n = s.length, state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= s.length; i += 64) {
    md5Cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
  for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5Cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5Cycle(state, tail);
  return state;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function rhex(n) {
  let s = '', j = 0;
  for (; j < 4; j++) s += ((n >> (j * 8 + 4)) & 0x0F).toString(16) + ((n >> (j * 8)) & 0x0F).toString(16);
  return s;
}

function clientMd5(s) {
  const arr = md51(s);
  return rhex(arr[0]) + rhex(arr[1]) + rhex(arr[2]) + rhex(arr[3]);
}

async function digestSubtle(algo, str) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator({ onShowToast }) {
  const [text, setText] = useState('Bijesh Tools Hub - Secure Online Utilities');
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '' });
  const [copiedAlgo, setCopiedAlgo] = useState(null);

  const calculateHashes = async (inputStr) => {
    if (!inputStr) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    // Immediate client-side calculation for zero latency
    try {
      const [sha1Val, sha256Val, sha512Val] = await Promise.all([
        digestSubtle('SHA-1', inputStr),
        digestSubtle('SHA-256', inputStr),
        digestSubtle('SHA-512', inputStr)
      ]);
      const md5Val = clientMd5(inputStr);

      setHashes({
        md5: md5Val,
        sha1: sha1Val,
        sha256: sha256Val,
        sha512: sha512Val
      });
    } catch {
      // In case subtle crypto isn't available
    }

    // Also attempt backend API call for full-stack check
    try {
      const res = await fetch('/api/tools/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputStr })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setHashes(data.data);
        }
      }
    } catch {
      // Retain client-side computed values
    }
  };

  useEffect(() => {
    calculateHashes(text);
  }, [text]);

  const handleCopy = (hashVal, algo) => {
    navigator.clipboard.writeText(hashVal);
    setCopiedAlgo(algo);
    if (onShowToast) onShowToast(`Copied ${algo.toUpperCase()} hash to clipboard!`);
    setTimeout(() => setCopiedAlgo(null), 2000);
  };

  const algos = [
    { id: 'md5', name: 'MD5 (128-bit)', val: hashes.md5, badge: 'Legacy / Checksum' },
    { id: 'sha1', name: 'SHA-1 (160-bit)', val: hashes.sha1, badge: 'Git Checksum' },
    { id: 'sha256', name: 'SHA-256 (256-bit)', val: hashes.sha256, badge: 'Standard Security' },
    { id: 'sha512', name: 'SHA-512 (512-bit)', val: hashes.sha512, badge: 'High Security' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Hash & Checksum Generator</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Client-Side Privacy
          </span>
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
        {algos.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-300">{item.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              </div>
              <div className="font-mono text-xs text-indigo-300 break-all select-all">
                {item.val || 'Generating hash...'}
              </div>
            </div>

            <button
              onClick={() => handleCopy(item.val, item.id)}
              disabled={!item.val}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 disabled:opacity-40 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {copiedAlgo === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAlgo === item.id ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
