import React, { useState } from 'react';
import { Regex as RegexIcon, Sparkles, Check, AlertCircle, Copy } from 'lucide-react';

const PRESETS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { name: 'URL / Link', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'g' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\b\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b', flags: 'g' },
  { name: 'Nepali Postal Code (5-digit)', pattern: '\\b\\d{5}\\b', flags: 'g' },
  { name: 'UUID v4', pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}', flags: 'g' }
];

export default function RegexTester({ onShowToast }) {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact Bijesh Sharma at dev@bijeshsharam.com.np or support@tools-hub.np for inquiries.');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = (pat, flg, src) => {
    setError('');
    if (!pat) {
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(pat, flg);
      const results = [];
      let match;

      if (flg.includes('g')) {
        let count = 0;
        while ((match = regex.exec(src)) !== null && count < 100) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match[0].length === 0) regex.lastIndex++;
          count++;
        }
      } else {
        match = regex.exec(src);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      setMatches(results);
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  };

  React.useEffect(() => {
    testRegex(pattern, flags, text);
  }, [pattern, flags, text]);

  const toggleFlag = (f) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Regex Presets */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-xs text-slate-400 font-medium mb-2">Common Regular Expression Presets:</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-medium transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Regular Expression Pattern & Flags</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 font-mono text-sm">
              <span className="text-slate-500 mr-1">/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="e.g. [a-z0-9]+"
                className="flex-1 bg-transparent text-indigo-300 focus:outline-none"
              />
              <span className="text-slate-500 ml-1">/</span>
            </div>

            {/* Flags */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-700 rounded-2xl">
              {['g', 'i', 'm', 's'].map(f => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                    flags.includes(f) ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={`Flag /${f}/`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Test Text */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Test String</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste sample text to test..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-sm text-slate-200 font-mono h-32 resize-none focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Matches List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
          <span className="font-semibold text-slate-200">
            Match Results: <span className="text-indigo-400 font-bold">{matches.length} found</span>
          </span>
          <span className="text-slate-500 font-mono">Flags: /{flags}/</span>
        </div>

        {matches.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 text-center">No pattern matches in test string.</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {matches.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">#{idx + 1}</span>
                  <span className="text-emerald-300 font-semibold">{m.text}</span>
                  <span className="text-slate-500 text-[11px]">(Index: {m.index})</span>
                </div>
                {m.groups.length > 0 && (
                  <span className="text-slate-400 text-[11px]">
                    Groups: [{m.groups.join(', ')}]
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
