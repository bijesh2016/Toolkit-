import React, { useState } from 'react';
import { Banknote, PieChart, Calculator, Sparkles } from 'lucide-react';

export default function LoanEmiCalculator({ onShowToast }) {
  const [principal, setPrincipal] = useState(2500000);
  const [interestRate, setInterestRate] = useState(11.5);
  const [tenureYears, setTenureYears] = useState(5);

  // EMI formula
  const r = (interestRate / 12) / 100;
  const n = tenureYears * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  const principalRatio = Math.round((principal / totalPayment) * 100);
  const interestRatio = 100 - principalRatio;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders Box */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Banknote className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Loan Parameters</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Loan Amount (Principal)</span>
              <span className="font-mono text-white font-bold">{principal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={principal}
              onChange={e => setPrincipal(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Annual Interest Rate</span>
              <span className="font-mono text-white font-bold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="22"
              step="0.25"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Tenure ({tenureYears} Years / {n} Months)</span>
              <span className="font-mono text-white font-bold">{tenureYears} Yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Monthly EMI Payment
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-white">
              रू {Math.round(emi).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400 ml-1">/ month</span>
            </div>

            <div className="mt-6 space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-bold text-amber-400">रू {Math.round(totalInterest).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Total Amount (Principal + Interest):</span>
                <span className="font-bold text-white">रू {Math.round(totalPayment).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Ratio Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Principal ({principalRatio}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Interest ({interestRatio}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div style={{ width: `${principalRatio}%` }} className="h-full bg-indigo-500"></div>
              <div style={{ width: `${interestRatio}%` }} className="h-full bg-amber-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
