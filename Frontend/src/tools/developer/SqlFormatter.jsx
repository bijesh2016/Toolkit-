import React, { useState } from 'react';
import { Database, Copy, Trash2, Sparkles, Check } from 'lucide-react';
import { format as formatSql } from 'sql-formatter';

const SAMPLE_SQL = `SELECT u.id, u.full_name, u.email, o.order_id, o.total_amount_npr, o.created_at FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.status = 'COMPLETED' AND o.total_amount_npr > 50000 ORDER BY o.created_at DESC LIMIT 20;`;

export default function SqlFormatter({ onShowToast }) {
  const [query, setQuery] = useState(SAMPLE_SQL);
  const [formatted, setFormatted] = useState('');
  const [dialect, setDialect] = useState('postgresql');
  const [uppercase, setUppercase] = useState(true);

  const handleFormat = () => {
    try {
      const res = formatSql(query, {
        language: dialect,
        keywordCase: uppercase ? 'upper' : 'preserve',
        tabWidth: 2
      });
      setFormatted(res);
      if (onShowToast) onShowToast('SQL formatted successfully!');
    } catch (err) {
      setFormatted(`-- Formatting Error: ${err.message}`);
    }
  };

  React.useEffect(() => {
    handleFormat();
  }, [dialect, uppercase]);

  const handleCopy = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    if (onShowToast) onShowToast('Copied SQL query to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <select
            value={dialect}
            onChange={e => setDialect(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
            <option value="sql">Standard SQL</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={e => setUppercase(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>UPPERCASE Keywords</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Format SQL
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Copy SQL"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col h-80 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Raw SQL Query</span>
            <button onClick={() => setQuery('')} className="hover:text-rose-400 text-slate-500">Clear</button>
          </div>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Paste your SQL statement here..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col h-80 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">Beautified Query</span>
            <span className="text-slate-500 font-mono text-[11px]">{dialect.toUpperCase()}</span>
          </div>
          <textarea
            readOnly
            value={formatted}
            className="flex-1 w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
