import React, { useState } from 'react';
import { Hourglass, Cake, Calendar, Sparkles } from 'lucide-react';

export default function AgeCalculator({ onShowToast }) {
  const [dob, setDob] = useState('2000-01-15');

  const calculateAge = () => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > today) return null;

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Next Birthday
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysUntilNext
    };
  };

  const age = calculateAge();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl max-w-md mx-auto">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
          <Hourglass className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Date of Birth</h3>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Select Your Birth Date</label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Age Display */}
      {age && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Years / Months / Days */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{age.years}</div>
              <span className="text-xs text-indigo-400 font-semibold mt-1 block">Years Old</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{age.months}</div>
              <span className="text-xs text-indigo-400 font-semibold mt-1 block">Months</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{age.days}</div>
              <span className="text-xs text-indigo-400 font-semibold mt-1 block">Days</span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-400">Total Days Lived</span>
              <div className="text-base font-bold text-white mt-0.5">{age.totalDays.toLocaleString()} days</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-400">Total Hours Lived</span>
              <div className="text-base font-bold text-white mt-0.5">{age.totalHours.toLocaleString()} hrs</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-950/40 to-slate-900 border border-pink-500/20 text-center">
              <span className="text-pink-400 flex items-center justify-center gap-1 font-semibold">
                <Cake className="w-3.5 h-3.5" /> Next Birthday
              </span>
              <div className="text-base font-bold text-white mt-0.5">In {age.daysUntilNext} days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
