import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Copy, ShieldCheck, Check, Sparkles } from 'lucide-react';

const PASSPHRASE_WORDS = [
  'everest', 'himalaya', 'pokhara', 'kathmandu', 'solu', 'mustang', 'rara',
  'rhino', 'tiger', 'phewa', 'lhotse', 'makalu', 'gorkha', 'annapurna',
  'falcon', 'emerald', 'sunset', 'nebula', 'matrix', 'cipher', 'quantum',
  'galaxy', 'aurora', 'zenith', 'pulsar', 'vortex', 'shadow', 'summit'
];

export default function PasswordGenerator({ onShowToast }) {
  const [mode, setMode] = useState('password'); // 'password' or 'passphrase'
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passphraseWordsCount, setPassphraseWordsCount] = useState(4);

  const [password, setPassword] = useState('');

  const generate = () => {
    if (mode === 'passphrase') {
      const selected = [];
      const array = new Uint32Array(passphraseWordsCount);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < passphraseWordsCount; i++) {
        selected.push(PASSPHRASE_WORDS[array[i] % PASSPHRASE_WORDS.length]);
      }
      setPassword(selected.join('-'));
      return;
    }

    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charset[randomValues[i] % charset.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generate();
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, passphraseWordsCount]);

  // Entropy calculation
  const calculateEntropy = () => {
    if (!password) return { bits: 0, strength: 'None', crackTime: 'Instant' };
    let pool = 0;
    if (mode === 'passphrase') {
      pool = PASSPHRASE_WORDS.length;
      const bits = Math.round(passphraseWordsCount * Math.log2(pool));
      return { bits, strength: bits > 60 ? 'Very Strong' : 'Strong', crackTime: 'Centuries' };
    }

    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const bits = Math.round(password.length * Math.log2(pool || 1));
    let strength = 'Weak';
    let crackTime = 'Minutes';
    if (bits > 40) { strength = 'Medium'; crackTime = 'Months'; }
    if (bits > 60) { strength = 'Strong'; crackTime = 'Decades'; }
    if (bits > 80) { strength = 'Very Strong'; crackTime = 'Millions of Years'; }

    return { bits, strength, crackTime };
  };

  const entropy = calculateEntropy();

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    if (onShowToast) onShowToast('Copied password securely to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Password Display Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-400">Generated Cryptographic Password</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Client-Side Crypto API
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 p-4 rounded-2xl bg-slate-950 border border-slate-700 font-mono text-base md:text-lg text-emerald-300 font-bold break-all select-all">
            {password || 'Select at least one character set'}
          </div>

          <button
            onClick={generate}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Generate New"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleCopy}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>

        {/* Entropy Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Entropy:</span>
            <span className="font-bold text-indigo-400 font-mono">{entropy.bits} bits</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 text-[11px] font-bold">
              {entropy.strength}
            </span>
          </div>
          <div className="text-slate-400">
            Estimated Crack Time: <strong className="text-slate-200">{entropy.crackTime}</strong>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 max-w-xs">
          <button
            onClick={() => setMode('password')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
              mode === 'password' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setMode('passphrase')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
              mode === 'passphrase' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Passphrase (Words)
          </button>
        </div>

        {mode === 'password' ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Password Length</span>
                <span className="font-mono text-white font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={e => setUseUpper(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={e => setUseLower(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={e => setUseNumbers(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={e => setUseSymbols(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Number of Words</span>
              <span className="font-mono text-white font-bold">{passphraseWordsCount} words</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={passphraseWordsCount}
              onChange={e => setPassphraseWordsCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}
