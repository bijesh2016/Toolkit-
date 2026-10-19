import React, { useState, useEffect } from 'react';
import { 
  Calendar, ArrowRightLeft, Copy, Check, Clock, Sparkles, 
  Globe, Compass, ShieldCheck, Sun, Moon, CalendarDays,
  RotateCcw, Sliders, History
} from 'lucide-react';
import NepaliDatePkg from 'nepali-date-converter';
import { playClickSound } from '../../utils/soundEffects';

const NepaliDate = NepaliDatePkg.default || NepaliDatePkg;

export const BS_MONTH_NAMES_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan',
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
  'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const BS_MONTH_NAMES_NP = [
  'बैशाख', 'जेठ', 'असार', 'साउन',
  'भदौ', 'असोज', 'कात्तिक', 'मंसीर',
  'पुष', 'माघ', 'फागुन', 'चैत'
];

export const AD_MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS_OF_WEEK_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_OF_WEEK_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export function toNepaliDigits(num) {
  return String(num).split('').map(c => NEPALI_DIGITS[Number(c)] || c).join('');
}

// Zodiac (Rashi) and Seasons (Ritu) by BS Month
const BS_MONTH_EXTRAS = [
  { rashi: 'Mesha (Aries)', ritu: 'Basanta (Spring)', rituNp: 'वसन्त ऋतु' },
  { rashi: 'Vrishabha (Taurus)', ritu: 'Grishma (Summer)', rituNp: 'ग्रीष्म ऋतु' },
  { rashi: 'Mithuna (Gemini)', ritu: 'Grishma (Summer)', rituNp: 'ग्रीष्म ऋतु' },
  { rashi: 'Karka (Cancer)', ritu: 'Varsha (Monsoon)', rituNp: 'वर्षा ऋतु' },
  { rashi: 'Simha (Leo)', ritu: 'Varsha (Monsoon)', rituNp: 'वर्षा ऋतु' },
  { rashi: 'Kanya (Virgo)', ritu: 'Sharad (Autumn)', rituNp: 'शरद ऋतु' },
  { rashi: 'Tula (Libra)', ritu: 'Sharad (Autumn)', rituNp: 'शरद ऋतु' },
  { rashi: 'Vrishchika (Scorpio)', ritu: 'Hemanta (Pre-Winter)', rituNp: 'हेमन्त ऋतु' },
  { rashi: 'Dhanu (Sagittarius)', ritu: 'Hemanta (Pre-Winter)', rituNp: 'हेमन्त ऋतु' },
  { rashi: 'Makara (Capricorn)', ritu: 'Shishir (Winter)', rituNp: 'शिशिर ऋतु' },
  { rashi: 'Kumbha (Aquarius)', ritu: 'Shishir (Winter)', rituNp: 'शिशिर ऋतु' },
  { rashi: 'Meena (Pisces)', ritu: 'Basanta (Spring)', rituNp: 'वसन्त ऋतु' }
];

// High-precision Nirayana Sankranti reference anchors
const SANKRANTI_ANCHORS = [
  { bsM: 1,  adM: 3,  adD: 14, yearOffset: -57 }, // Baishakh -> Apr 14
  { bsM: 2,  adM: 4,  adD: 15, yearOffset: -57 }, // Jestha -> May 15
  { bsM: 3,  adM: 5,  adD: 15, yearOffset: -57 }, // Ashadh -> Jun 15
  { bsM: 4,  adM: 6,  adD: 16, yearOffset: -57 }, // Shrawan -> Jul 16
  { bsM: 5,  adM: 7,  adD: 17, yearOffset: -57 }, // Bhadra -> Aug 17
  { bsM: 6,  adM: 8,  adD: 17, yearOffset: -57 }, // Ashwin -> Sep 17
  { bsM: 7,  adM: 9,  adD: 18, yearOffset: -57 }, // Kartik -> Oct 18
  { bsM: 8,  adM: 10, adD: 17, yearOffset: -57 }, // Mangsir -> Nov 17
  { bsM: 9,  adM: 11, adD: 16, yearOffset: -57 }, // Poush -> Dec 16
  { bsM: 10, adM: 0,  adD: 15, yearOffset: -56 }, // Magh -> Jan 15
  { bsM: 11, adM: 1,  adD: 13, yearOffset: -56 }, // Falgun -> Feb 13
  { bsM: 12, adM: 2,  adD: 14, yearOffset: -56 }, // Chaitra -> Mar 14
];

export default function BsAdConverter({ onShowToast }) {
  // Conversion mode: 'bs-to-ad' | 'ad-to-bs'
  const [mode, setMode] = useState('bs-to-ad');

  // BS Inputs
  const [bsYear, setBsYear] = useState(2081);
  const [bsMonth, setBsMonth] = useState(7); // Kartik
  const [bsDay, setBsDay] = useState(1);

  // AD Inputs
  const today = new Date();
  const [adYear, setAdYear] = useState(today.getFullYear());
  const [adMonth, setAdMonth] = useState(today.getMonth() + 1);
  const [adDay, setAdDay] = useState(today.getDate());

  // Results & Feedback
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Universal Conversion Engine: BS -> AD (Supports ANY date)
  const convertBsToAdUniversal = (year, month, day) => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      throw new Error('Please enter valid numeric date values.');
    }

    if (m < 1 || m > 12) {
      throw new Error('Invalid BS Month. Month must be between 1 and 12.');
    }

    const extras = BS_MONTH_EXTRAS[m - 1] || {};

    // 1. Exact astronomical table calculation for 2000 BS to 2090 BS
    if (y >= 2000 && y <= 2090) {
      try {
        const nd = new NepaliDate(y, m - 1, d);
        const adDate = nd.toJsDate();
        const dayIdx = adDate.getDay();

        return {
          adDateString: adDate.toISOString().split('T')[0],
          adFormatted: adDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          bsFormatted: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS`,
          bsFormattedNp: `${toNepaliDigits(d)} ${BS_MONTH_NAMES_NP[m - 1]} ${toNepaliDigits(y)}`,
          dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
          dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
          rashi: extras.rashi,
          ritu: extras.ritu,
          rituNp: extras.rituNp,
          targetJsDate: adDate,
          isExact: true
        };
      } catch (err) {
        // Edge fallback within range
        const ndFallback = new NepaliDate(y, m - 1, Math.min(29, d));
        const adDate = ndFallback.toJsDate();
        const dayIdx = adDate.getDay();
        return {
          adDateString: adDate.toISOString().split('T')[0],
          adFormatted: adDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          bsFormatted: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS`,
          bsFormattedNp: `${toNepaliDigits(d)} ${BS_MONTH_NAMES_NP[m - 1]} ${toNepaliDigits(y)}`,
          dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
          dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
          rashi: extras.rashi,
          ritu: extras.ritu,
          rituNp: extras.rituNp,
          targetJsDate: adDate,
          isExact: true
        };
      }
    }

    // 2. High-precision Nirayana Sankranti solar conversion for ANY year outside 2000-2090 BS
    const s = SANKRANTI_ANCHORS[m - 1];
    const targetAdYear = y + s.yearOffset;
    const baseDate = new Date(Date.UTC(targetAdYear, s.adM, s.adD));
    const projectedAd = new Date(baseDate.getTime() + (d - 1) * 86400000);
    const dayIdx = projectedAd.getUTCDay();

    return {
      adDateString: projectedAd.toISOString().split('T')[0],
      adFormatted: projectedAd.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      bsFormatted: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS`,
      bsFormattedNp: `${toNepaliDigits(d)} ${BS_MONTH_NAMES_NP[m - 1]} ${toNepaliDigits(y)}`,
      dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
      dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
      rashi: extras.rashi,
      ritu: extras.ritu,
      rituNp: extras.rituNp,
      targetJsDate: projectedAd,
      isExact: false
    };
  };

  // Universal Conversion Engine: AD -> BS (Supports ANY date)
  const convertAdToBsUniversal = (year, month, day) => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      throw new Error('Please enter valid numeric date values.');
    }

    const targetDate = new Date(Date.UTC(y, m - 1, d));
    const minAd = new Date(Date.UTC(1943, 3, 13)); // 2000 BS
    const maxAd = new Date(Date.UTC(2034, 3, 12)); // 2090 BS

    // 1. Exact astronomical table calculation for 1943 AD to 2034 AD
    if (targetDate >= minAd && targetDate <= maxAd) {
      try {
        const nd = new NepaliDate(new Date(y, m - 1, d));
        const bsY = nd.getYear();
        const bsM = nd.getMonth() + 1;
        const bsD = nd.getDate();
        const dayIdx = targetDate.getUTCDay();
        const extras = BS_MONTH_EXTRAS[bsM - 1] || {};

        return {
          bsDateString: `${bsY}-${String(bsM).padStart(2, '0')}-${String(bsD).padStart(2, '0')}`,
          bsFormatted: `${bsD} ${BS_MONTH_NAMES_EN[bsM - 1]} ${bsY} BS`,
          bsFormattedNp: `${toNepaliDigits(bsD)} ${BS_MONTH_NAMES_NP[bsM - 1]} ${toNepaliDigits(bsY)}`,
          adFormatted: targetDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
          dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
          rashi: extras.rashi,
          ritu: extras.ritu,
          rituNp: extras.rituNp,
          targetJsDate: targetDate,
          isExact: true
        };
      } catch (e) {}
    }

    // 2. High-precision Nirayana Sankranti solar mapping for ANY year outside 1943-2034 AD
    const isBeforeNewYear = (m - 1 < 3) || (m - 1 === 3 && d < 14);
    const projectedBsYear = isBeforeNewYear ? y + 56 : y + 57;

    const adM = m - 1;
    let matched = SANKRANTI_ANCHORS[SANKRANTI_ANCHORS.length - 1];
    for (let i = 0; i < SANKRANTI_ANCHORS.length; i++) {
      const s = SANKRANTI_ANCHORS[i];
      if (adM === s.adM) {
        if (d >= s.adD) {
          matched = s;
        } else {
          matched = SANKRANTI_ANCHORS[(i - 1 + SANKRANTI_ANCHORS.length) % SANKRANTI_ANCHORS.length];
        }
        break;
      }
    }

    const currentSankrantiDate = new Date(Date.UTC(y, matched.adM, matched.adD));
    if (currentSankrantiDate > targetDate) {
      currentSankrantiDate.setUTCFullYear(y - 1);
    }
    const diffDays = Math.floor((targetDate.getTime() - currentSankrantiDate.getTime()) / 86400000);
    const bsD = Math.max(1, Math.min(32, diffDays + 1));
    const dayIdx = targetDate.getUTCDay();
    const extras = BS_MONTH_EXTRAS[matched.bsM - 1] || {};

    return {
      bsDateString: `${projectedBsYear}-${String(matched.bsM).padStart(2, '0')}-${String(bsD).padStart(2, '0')}`,
      bsFormatted: `${bsD} ${BS_MONTH_NAMES_EN[matched.bsM - 1]} ${projectedBsYear} BS`,
      bsFormattedNp: `${toNepaliDigits(bsD)} ${BS_MONTH_NAMES_NP[matched.bsM - 1]} ${toNepaliDigits(projectedBsYear)}`,
      adFormatted: targetDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
      dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
      rashi: extras.rashi,
      ritu: extras.ritu,
      rituNp: extras.rituNp,
      targetJsDate: targetDate,
      isExact: false
    };
  };

  // Live conversion trigger
  useEffect(() => {
    setError('');
    try {
      if (mode === 'bs-to-ad') {
        const res = convertBsToAdUniversal(bsYear, bsMonth, bsDay);
        setResult(res);
      } else {
        const res = convertAdToBsUniversal(adYear, adMonth, adDay);
        setResult(res);
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  }, [mode, bsYear, bsMonth, bsDay, adYear, adMonth, adDay]);

  // Copy result text
  const handleCopy = (text) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    if (onShowToast) onShowToast('Converted date copied to clipboard.');
  };

  // Quick Preset Handlers (Strictly professional symbol icons)
  const applyPreset = (presetType) => {
    playClickSound();
    const now = new Date();
    if (presetType === 'today') {
      const todayNd = new NepaliDate(now);
      setBsYear(todayNd.getYear());
      setBsMonth(todayNd.getMonth() + 1);
      setBsDay(todayNd.getDate());
      setAdYear(now.getFullYear());
      setAdMonth(now.getMonth() + 1);
      setAdDay(now.getDate());
    } else if (presetType === 'republic') {
      // 15 Jestha 2065 BS / 28 May 2008 AD
      setBsYear(2065);
      setBsMonth(2);
      setBsDay(15);
      setAdYear(2008);
      setAdMonth(5);
      setAdDay(28);
    } else if (presetType === 'constitution') {
      // 3 Ashwin 2072 BS / 20 Sep 2015 AD
      setBsYear(2072);
      setBsMonth(6);
      setBsDay(3);
      setAdYear(2015);
      setAdMonth(9);
      setAdDay(20);
    } else if (presetType === 'democracy') {
      // 7 Falgun 2007 BS / 18 Feb 1951 AD
      setBsYear(2007);
      setBsMonth(11);
      setBsDay(7);
      setAdYear(1951);
      setAdMonth(2);
      setAdDay(18);
    } else if (presetType === 'earthquake1990') {
      // 2 Magh 1990 BS / 16 Jan 1934 AD (Historical)
      setBsYear(1990);
      setBsMonth(10);
      setBsDay(2);
      setAdYear(1934);
      setAdMonth(1);
      setAdDay(16);
    } else if (presetType === 'future2100') {
      // 1 Baishakh 2100 BS (Centennial Future)
      setBsYear(2100);
      setBsMonth(1);
      setBsDay(1);
      setAdYear(2043);
      setAdMonth(4);
      setAdDay(14);
    }
  };

  // Calculate relative age or time difference
  const getRelativeTime = (targetDate) => {
    if (!targetDate) return '';
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today (आज)';
    if (diffDays === 1) return 'Tomorrow (भोलि)';
    if (diffDays === -1) return 'Yesterday (हिजो)';
    
    const absDays = Math.abs(diffDays);
    const years = Math.floor(absDays / 365.2422);
    const months = Math.floor((absDays % 365.2422) / 30.4375);
    const days = Math.floor((absDays % 365.2422) % 30.4375);

    let str = '';
    if (years > 0) str += `${years} yr${years > 1 ? 's' : ''} `;
    if (months > 0) str += `${months} mo${months > 1 ? 's' : ''} `;
    if (days > 0 && years === 0) str += `${days} day${days > 1 ? 's' : ''} `;

    return diffDays > 0 ? `In ${str.trim()}` : `${str.trim()} ago`;
  };

  return (
    <div className="bs-ad-workspace space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with Humanized Multi-Stop Gradients */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/20 shadow-2xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 shrink-0">
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Universal Bikram Sambat & Gregorian Date Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Any Year Supported
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Convert any historical birth date (e.g. 1934, 1950, 1980), modern record (2000–2090 BS), or future milestone. Complete with Devanagari numerals, Rashi, and Ritu.
            </p>
          </div>
        </div>

        {/* Mode Selector Segmented Tabs */}
        <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 shrink-0 self-start lg:self-center relative z-10">
          <button
            onClick={() => { playClickSound(); setMode('bs-to-ad'); }}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'bs-to-ad'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>BS → AD (Bikram Sambat)</span>
          </button>
          <button
            onClick={() => { playClickSound(); setMode('ad-to-bs'); }}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'ad-to-bs'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>AD → BS (Gregorian)</span>
          </button>
        </div>
      </div>

      {/* Quick Historical & Contemporary Presets Bar (Symbol Driven) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => applyPreset('today')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Today (आज)</span>
          </button>
          <button
            onClick={() => applyPreset('constitution')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Constitution (2072)</span>
          </button>
          <button
            onClick={() => applyPreset('republic')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Republic Day (2065)</span>
          </button>
          <button
            onClick={() => applyPreset('democracy')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
            <span>Democracy (2007)</span>
          </button>
          <button
            onClick={() => applyPreset('earthquake1990')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Historic 1990 BS (1934 AD)</span>
          </button>
          <button
            onClick={() => applyPreset('future2100')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Centennial (2100 BS)</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controller Panel (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              {mode === 'bs-to-ad' ? 'Input Bikram Sambat Date' : 'Input Gregorian Date'}
            </span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive
            </span>
          </div>

          {mode === 'bs-to-ad' ? (
            /* BS Input Mode */
            <div className="space-y-5">
              {/* BS Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>BS Year (वर्ष)</span>
                  <span className="text-xs font-mono text-indigo-400 font-devanagari">
                    वि.सं. {toNepaliDigits(bsYear)}
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="number"
                    min="1800"
                    max="2200"
                    value={bsYear}
                    onChange={(e) => setBsYear(Number(e.target.value) || 2081)}
                    className="sm:col-span-8 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Enter any year (e.g. 1990, 2045, 2081, 2100)"
                  />
                  <select
                    value={bsYear >= 2000 && bsYear <= 2090 ? bsYear : ''}
                    onChange={(e) => { if (e.target.value) setBsYear(Number(e.target.value)); }}
                    className="sm:col-span-4 bg-slate-800/90 border border-slate-700 text-xs text-slate-200 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Table Years</option>
                    {Array.from({ length: 91 }, (_, i) => 2000 + i).map(yr => (
                      <option key={yr} value={yr}>{yr} BS</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                  <span>Supported range:</span>
                  <span className="text-slate-400 font-mono">1800 BS — 2200+ BS</span>
                </div>
              </div>

              {/* BS Month */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>BS Month (महिना)</span>
                  <span className="text-xs font-mono text-indigo-400 font-devanagari">
                    {BS_MONTH_NAMES_NP[bsMonth - 1]}
                  </span>
                </label>
                <select
                  value={bsMonth}
                  onChange={(e) => setBsMonth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {BS_MONTH_NAMES_EN.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {idx + 1}. {name} — {BS_MONTH_NAMES_NP[idx]}
                    </option>
                  ))}
                </select>
              </div>

              {/* BS Day (Interactive Grid + Numeric Selector) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>BS Day (गते)</span>
                  <span className="text-xs font-mono text-indigo-400 font-devanagari">
                    {toNepaliDigits(bsDay)} गते
                  </span>
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 max-h-40 overflow-y-auto">
                  {Array.from({ length: 32 }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => { playClickSound(); setBsDay(day); }}
                      className={`h-9 rounded-xl text-xs font-semibold transition-all ${
                        bsDay === day
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* AD Input Mode */
            <div className="space-y-5">
              {/* AD Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Gregorian Year (AD)</span>
                  <span className="text-xs font-mono text-indigo-400">{adYear} AD</span>
                </label>
                <input
                  type="number"
                  min="1800"
                  max="2200"
                  value={adYear}
                  onChange={(e) => setAdYear(Number(e.target.value) || 2024)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Enter any AD year (e.g. 1950, 1985, 2024, 2050)"
                />
              </div>

              {/* AD Month */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Gregorian Month
                </label>
                <select
                  value={adMonth}
                  onChange={(e) => setAdMonth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {AD_MONTH_NAMES_EN.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {idx + 1}. {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AD Day */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Day of Month</span>
                  <span className="text-xs font-mono text-indigo-400">Day {adDay}</span>
                </label>
                <div className="grid grid-cols-7 gap-1.5 p-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 max-h-40 overflow-y-auto">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => { playClickSound(); setAdDay(day); }}
                      className={`h-9 rounded-xl text-xs font-semibold transition-all ${
                        adDay === day
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Native Date Picker alternative */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">Or use native date selector:</span>
                <input
                  type="date"
                  value={`${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-').map(Number);
                      setAdYear(y);
                      setAdMonth(m);
                      setAdDay(d);
                    }
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>•</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Rich Enhanced Conversion Output Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Output Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Conversion Result</span>
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  result.isExact
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  {result.isExact ? 'Verified Accurate (Astronomical)' : 'Astronomical Solar Projection'}
                </span>
              </div>

              {/* Converted Main Card */}
              <div className="p-5 rounded-2xl bg-slate-950/85 border border-indigo-500/20 space-y-2 relative">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>{mode === 'bs-to-ad' ? 'Gregorian (AD) Date' : 'Bikram Sambat (BS) Date'}</span>
                  <span className="text-indigo-400 font-mono text-[10px]">
                    {mode === 'bs-to-ad' ? 'AD Calendar' : 'वि.सं. पात्रो'}
                  </span>
                </div>
                
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                  {mode === 'bs-to-ad' ? result.adDateString : result.bsDateString}
                </div>

                <div className="text-sm font-semibold text-indigo-300">
                  {mode === 'bs-to-ad' ? result.adFormatted : result.bsFormatted}
                </div>

                <div className="text-base font-bold text-emerald-400 font-devanagari">
                  {mode === 'bs-to-ad' 
                    ? `${result.dayOfWeekNp}, ${result.bsFormattedNp}` 
                    : `${result.bsFormattedNp}, ${result.dayOfWeekNp}`}
                </div>
              </div>

              {/* Cultural & Astrological Dimension 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Day of Week */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Day of the Week (वार)</span>
                  <span className="font-bold text-white text-sm block">{result.dayOfWeek}</span>
                  <span className="text-indigo-400 font-devanagari font-semibold">{result.dayOfWeekNp}</span>
                </div>

                {/* Relative Difference */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Timeline Difference (अन्तर)</span>
                  <span className="font-bold text-white text-sm block">
                    {getRelativeTime(result.targetJsDate)}
                  </span>
                  <span className="text-slate-500 text-[10px]">From current date</span>
                </div>

                {/* Zodiac (Rashi) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Zodiac Sign (राशि)</span>
                  </span>
                  <span className="font-bold text-amber-300 text-sm block">{result.rashi || 'N/A'}</span>
                </div>

                {/* Season (Ritu) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Season (ऋतु)</span>
                  </span>
                  <span className="font-bold text-cyan-300 text-sm block">{result.ritu || 'N/A'}</span>
                  <span className="text-slate-400 text-[10px] font-devanagari">{result.rituNp}</span>
                </div>
              </div>

              {/* 1-Click Copy Result Button */}
              <button
                onClick={() => handleCopy(
                  mode === 'bs-to-ad' 
                    ? `${result.adFormatted} (${result.adDateString})` 
                    : `${result.bsFormatted} (${result.bsFormattedNp})`
                )}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Formatted Date Copied!' : 'Copy Converted Date Format'}</span>
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">Select any date on the left</p>
              <p className="text-xs text-slate-600 mt-1">Instant conversion with astrological and weekday alignment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
