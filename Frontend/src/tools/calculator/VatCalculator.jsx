import React, { useState } from 'react';
import { CreditCard, ArrowRight, Sparkles } from 'lucide-react';

export default function VatCalculator({ onShowToast }) {
  const [amount, setAmount] = useState('10000');
  const [vatRate, setVatRate] = useState(13); // Default 13% for Nepal
  const [calculationMode, setCalculationMode] = useState('add'); // 'add' (exclusive) or 'remove' (inclusive)
  const [discountPercent, setDiscountPercent] = useState(0);

  const rawAmt = Number(amount) || 0;
  const discountAmt = (rawAmt * (Number(discountPercent) || 0)) / 100;
  const discountedBase = Math.max(0, rawAmt - discountAmt);

  let netAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (calculationMode === 'add') {
    netAmount = discountedBase;
    vatAmount = (netAmount * vatRate) / 100;
    grossAmount = netAmount + vatAmount;
  } else {
    grossAmount = discountedBase;
    netAmount = grossAmount / (1 + vatRate / 100);
    vatAmount = grossAmount - netAmount;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setCalculationMode('add')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            calculationMode === 'add' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Add VAT (Price Excl. VAT)
        </button>
        <button
          onClick={() => setCalculationMode('remove')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            calculationMode === 'remove' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Extract VAT (Price Incl. VAT)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">VAT & Discount Calculator</h3>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {calculationMode === 'add' ? 'Net Price (Before VAT)' : 'Gross Price (Inclusive of VAT)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">VAT Rate (%)</label>
              <select
                value={vatRate}
                onChange={e => setVatRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value={13}>13% (Standard Nepal VAT)</option>
                <option value={10}>10%</option>
                <option value={18}>18% (India GST)</option>
                <option value={5}>5%</option>
                <option value={20}>20% (UK VAT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Final Total Amount
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-white">
              रू {grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Net Amount:</span>
                <span className="font-bold text-white">रू {netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">VAT Amount ({vatRate}%):</span>
                <span className="font-bold text-emerald-400">रू {vatAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Applied Discount:</span>
                  <span className="font-bold text-rose-400">- रू {discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
