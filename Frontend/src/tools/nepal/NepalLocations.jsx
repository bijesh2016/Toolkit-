import React, { useState } from 'react';
import { MapPin, Search, Copy, Check, Building2, Compass } from 'lucide-react';
import { NEPAL_PROVINCES } from '../../../../Backend/src/utils/nepalData.js';

export default function NepalLocations({ onShowToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');

  const filteredProvinces = NEPAL_PROVINCES.filter(province => {
    if (selectedProvince !== 'all' && province.id !== Number(selectedProvince)) {
      return false;
    }
    return true;
  }).map(province => {
    const q = searchTerm.toLowerCase();
    const matchingDistricts = province.districts.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.hq.toLowerCase().includes(q) ||
      d.postalCode.includes(q)
    );
    return {
      ...province,
      districts: matchingDistricts
    };
  }).filter(p => p.districts.length > 0 || (searchTerm === '' && selectedProvince !== 'all'));

  const handleCopyCode = (code, name) => {
    navigator.clipboard.writeText(code);
    if (onShowToast) onShowToast(`Copied postal code ${code} for ${name}!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search and Filter */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by District name, Headquarters, or Postal Code (e.g. Kathmandu, 44600, Pokhara)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All 7 Provinces (सबै प्रदेशहरू)</option>
            {NEPAL_PROVINCES.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.nameNp})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Provinces Accordion / Grid */}
      <div className="space-y-6">
        {filteredProvinces.map(prov => (
          <div key={prov.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{prov.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    {prov.nameNp}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-500" /> Capital: <strong className="text-slate-300">{prov.capital}</strong></span>
                  <span>•</span>
                  <span>{prov.districts.length} Districts</span>
                </div>
              </div>
            </div>

            {/* Districts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {prov.districts.map(dist => (
                <div
                  key={dist.name}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {dist.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      HQ: <span className="text-slate-300">{dist.hq}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(dist.postalCode, dist.name)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-xs font-mono text-slate-300 hover:text-white border border-slate-800 transition-colors"
                    title="Click to copy postal code"
                  >
                    <span>{dist.postalCode}</span>
                    <Copy className="w-3 h-3 text-slate-500 group-hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredProvinces.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
            <Compass className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No districts found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
