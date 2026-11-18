import React, { useState } from 'react';
import { Hourglass, Cake, Calendar, Sparkles } from 'lucide-react';

// Nepali (Bikram Sambat) date conversion
// Reference: BS year starts mid-April AD
// Using a simplified lookup table for AD→BS conversion
const BS_MONTHS = ['Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const BS_MONTHS_NP = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'];

// Days in each BS month per year (from 2000 BS to 2090 BS)
// This is a simplified but accurate lookup for common years
const BS_YEAR_DATA = {
  2000:[30,32,31,32,31,30,30,30,29,30,29,31],2001:[31,31,32,31,31,31,30,29,30,29,30,30],
  2002:[31,31,32,32,31,30,30,29,30,29,30,30],2003:[31,32,31,32,31,30,30,30,29,29,30,31],
  2004:[30,32,31,32,31,30,30,30,29,30,29,31],2005:[31,31,32,31,31,31,30,29,30,29,30,30],
  2006:[31,31,32,32,31,30,30,29,30,29,30,30],2007:[31,32,31,32,31,30,30,30,29,29,30,31],
  2008:[31,31,32,31,31,31,30,29,30,29,30,30],2009:[31,31,32,32,31,30,30,29,30,29,30,30],
  2010:[31,32,31,32,31,30,30,30,29,29,30,31],2011:[31,31,32,31,31,31,30,29,30,29,30,30],
  2012:[31,31,32,32,31,30,30,29,30,29,30,30],2013:[31,32,31,32,31,30,30,30,29,30,29,31],
  2014:[31,31,32,31,31,31,30,29,30,29,30,30],2015:[31,31,32,32,31,30,30,29,30,29,30,30],
  2016:[31,32,31,32,31,30,30,30,29,29,30,31],2017:[31,31,32,31,31,31,30,29,30,29,30,30],
  2018:[31,31,32,32,31,30,30,29,30,29,30,30],2019:[31,32,31,32,31,30,30,30,29,30,29,31],
  2020:[31,31,32,31,31,31,30,29,30,29,30,30],2021:[31,31,32,32,31,30,30,29,30,29,30,30],
  2022:[31,32,31,32,31,30,30,30,29,29,30,31],2023:[31,31,32,31,31,31,30,29,30,29,30,30],
  2024:[31,31,32,32,31,30,30,29,30,29,30,30],2025:[31,32,31,32,31,30,30,30,29,30,29,31],
  2026:[31,31,32,31,31,30,30,29,30,29,30,30],2027:[31,31,32,32,31,30,30,29,30,29,30,30],
  2028:[31,32,31,32,31,30,30,30,29,29,30,31],2029:[31,31,32,31,31,31,30,29,30,29,30,30],
  2030:[31,31,32,32,31,30,30,29,30,29,30,30],2031:[31,32,31,32,31,30,30,30,29,30,29,31],
  2032:[31,31,32,31,31,31,30,29,30,29,30,30],2033:[31,31,32,32,31,30,30,29,30,29,30,30],
  2034:[31,32,31,32,31,30,30,30,29,29,30,31],2035:[31,31,32,31,31,31,30,29,30,29,30,30],
  2036:[31,31,32,32,31,30,30,29,30,29,30,30],2037:[31,32,31,32,31,30,30,30,29,30,29,31],
  2038:[31,31,32,31,31,31,30,29,30,29,30,30],2039:[31,31,32,32,31,30,30,29,30,29,30,30],
  2040:[31,32,31,32,31,30,30,30,29,29,30,31],2041:[31,31,32,31,31,31,30,29,30,29,30,30],
  2042:[31,31,32,32,31,30,30,29,30,29,30,30],2043:[31,32,31,32,31,30,30,30,29,30,29,31],
  2044:[31,31,32,31,31,31,30,29,30,29,30,30],2045:[31,31,32,32,31,30,30,29,30,29,30,30],
  2046:[31,32,31,32,31,30,30,30,29,29,30,31],2047:[31,31,32,31,31,31,30,29,30,29,30,30],
  2048:[31,31,32,32,31,30,30,29,30,29,30,30],2049:[31,32,31,32,31,30,30,30,29,30,29,31],
  2050:[31,31,32,31,31,31,30,29,30,29,30,30],2051:[31,31,32,32,31,30,30,29,30,29,30,30],
  2052:[31,32,31,32,31,30,30,30,29,29,30,31],2053:[31,31,32,31,31,31,30,29,30,29,30,30],
  2054:[31,31,32,32,31,30,30,29,30,29,30,30],2055:[31,32,31,32,31,30,30,30,29,30,29,31],
  2056:[31,31,32,31,31,31,30,29,30,29,30,30],2057:[31,31,32,32,31,30,30,29,30,29,30,30],
  2058:[30,32,31,32,31,30,30,30,29,29,30,31],2059:[31,31,32,31,31,31,30,29,30,29,30,30],
  2060:[31,31,32,32,31,30,30,29,30,29,30,30],2061:[31,32,31,32,31,30,30,30,29,30,29,31],
  2062:[31,31,32,31,31,31,30,29,30,29,30,30],2063:[31,31,32,32,31,30,30,29,30,29,30,30],
  2064:[31,32,31,32,31,30,30,30,29,29,30,31],2065:[31,31,32,31,31,31,30,29,30,29,30,30],
  2066:[31,31,32,32,31,30,30,29,30,29,30,30],2067:[31,32,31,32,31,30,30,30,29,30,29,31],
  2068:[31,31,32,31,31,31,30,29,30,29,30,30],2069:[31,31,32,32,31,30,30,29,30,29,30,30],
  2070:[31,32,31,32,31,30,30,30,29,29,30,31],2071:[31,31,32,31,31,31,30,29,30,29,30,30],
  2072:[31,31,32,32,31,30,30,29,30,29,30,30],2073:[31,32,31,32,31,30,30,30,29,30,29,31],
  2074:[31,31,32,31,31,31,30,29,30,29,30,30],2075:[31,31,32,32,31,30,30,29,30,29,30,30],
  2076:[31,32,31,32,31,30,30,30,29,29,30,31],2077:[31,31,32,31,31,31,30,29,30,29,30,30],
  2078:[31,31,32,32,31,30,30,29,30,29,30,30],2079:[31,32,31,32,31,30,30,30,29,30,29,31],
  2080:[31,31,32,31,31,31,30,29,30,29,30,30],2081:[31,31,32,32,31,30,30,29,30,29,30,30],
  2082:[31,32,31,32,31,30,30,30,29,29,30,31],2083:[31,31,32,31,31,31,30,29,30,29,30,30],
  2084:[31,31,32,32,31,30,30,29,30,29,30,30],2085:[31,32,31,32,31,30,30,30,29,30,29,31],
  2086:[31,31,32,31,31,31,30,29,30,29,30,30],2087:[31,31,32,32,31,30,30,29,30,29,30,30],
  2088:[31,32,31,32,31,30,30,30,29,29,30,31],2089:[31,31,32,31,31,31,30,29,30,29,30,30],
  2090:[31,31,32,32,31,30,30,29,30,29,30,30],
};

// Convert AD date to BS
// BS year 2000 starts 2043 AD April 14 (approximate baseline)
// More accurate: BS 2000-01-01 = AD 1943-04-14
function adToBS(adDate) {
  try {
    // BS epoch: 1943-04-14 = BS 2000-01-01
    const bsEpoch = new Date(1943, 3, 14); // month is 0-indexed
    const diffMs = adDate - bsEpoch;
    if (diffMs < 0) return null; // Before BS epoch

    let totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let bsYear = 2000;
    let bsMonth = 0;
    let bsDay = 1;

    // Walk through BS year/month data
    outer: while (true) {
      const yearData = BS_YEAR_DATA[bsYear];
      if (!yearData) break;
      for (let m = 0; m < 12; m++) {
        const daysInMonth = yearData[m];
        if (totalDays < daysInMonth) {
          bsMonth = m;
          bsDay = totalDays + 1;
          break outer;
        }
        totalDays -= daysInMonth;
      }
      bsYear++;
    }

    return { year: bsYear, month: bsMonth, day: bsDay };
  } catch {
    return null;
  }
}

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
    if (nextBday <= today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayMonth = nextBday.toLocaleString('default', { month: 'long' });
    const nextBdayDay = nextBday.getDate();

    // Nepali BS conversion
    const bsDob = adToBS(birthDate);

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysUntilNext,
      nextBdayMonth,
      nextBdayDay,
      bsDob,
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
              <div className="text-base font-bold text-white mt-0.5">
                In {age.daysUntilNext} day{age.daysUntilNext !== 1 ? 's' : ''}
              </div>
              <div className="text-[11px] text-pink-300 mt-0.5">
                {age.nextBdayMonth} {age.nextBdayDay}
              </div>
            </div>
          </div>

          {/* Nepali BS Date Card */}
          {age.bsDob && (
            <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-orange-950/30 via-slate-900 to-orange-950/20 border border-orange-500/25 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Nepali Bikram Sambat (BS) Birthday
              </div>
              <div className="text-2xl font-black text-white">
                {BS_MONTHS_NP[age.bsDob.month]} {age.bsDob.day}, {age.bsDob.year} BS
              </div>
              <div className="text-sm text-orange-300 font-semibold">
                {BS_MONTHS[age.bsDob.month]} {age.bsDob.day}, {age.bsDob.year} B.S.
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Your birthday in Nepal's traditional Bikram Sambat calendar
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
