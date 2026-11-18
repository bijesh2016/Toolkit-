import React, { useMemo, useState } from 'react';
import { Cake, CalendarDays, Clock3, ShieldCheck } from 'lucide-react';
import NepaliDatePkg from 'nepali-date-converter';
import {
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NP,
  toNepaliDigits
} from './BsAdConverter';

const NepaliDate = NepaliDatePkg.default || NepaliDatePkg;
const MS_PER_DAY = 86400000;

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDuration(start, end) {
  if (start > end) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays: Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY)
  };
}

function convertAdToBs(date) {
  try {
    const nepaliDate = new NepaliDate(date);
    const year = nepaliDate.getYear();
    const month = nepaliDate.getMonth() + 1;
    const day = nepaliDate.getDate();
    return {
      year,
      month,
      day,
      label: `${day} ${BS_MONTH_NAMES_EN[month - 1]} ${year} BS`,
      labelNp: `${toNepaliDigits(day)} ${BS_MONTH_NAMES_NP[month - 1]} ${toNepaliDigits(year)}`
    };
  } catch {
    return null;
  }
}

function convertBsToAd(year, month, day) {
  try {
    return new NepaliDate(year, month - 1, day).toJsDate();
  } catch {
    return null;
  }
}

export default function NepaliDateAgeToolkit() {
  const today = new Date();
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [comparisonDate, setComparisonDate] = useState(toDateInputValue(today));
  const [bsYear, setBsYear] = useState('2081');
  const [bsMonth, setBsMonth] = useState('1');
  const [bsDay, setBsDay] = useState('1');
  const [conversionError, setConversionError] = useState('');

  const age = useMemo(() => {
    const start = parseDate(birthDate);
    const end = parseDate(comparisonDate);
    if (!start || !end || start > end) return null;

    const duration = formatDuration(start, end);
    const birthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (birthday < end) birthday.setFullYear(end.getFullYear() + 1);

    return {
      ...duration,
      nextBirthdayDays: Math.ceil((birthday.getTime() - end.getTime()) / MS_PER_DAY),
      birthBs: convertAdToBs(start),
      comparisonBs: convertAdToBs(end)
    };
  }, [birthDate, comparisonDate]);

  const convertedDate = useMemo(() => {
    const year = Number(bsYear);
    const month = Number(bsMonth);
    const day = Number(bsDay);
    if (!year || !month || !day) return null;
    return convertBsToAd(year, month, day);
  }, [bsYear, bsMonth, bsDay]);

  const handleBsChange = (setter) => (event) => {
    setConversionError('');
    setter(event.target.value);
  };

  const handleInvalidConversion = () => {
    if (!convertedDate) {
      setConversionError('Enter a valid BS date. The converter supports dates in the package table range.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-3xl border border-indigo-100 bg-white/80 p-5 shadow-xl sm:p-7">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Nepali Date and Age Toolkit</h2>
            <p className="mt-1 text-sm text-slate-500">
              Calculate age, compare dates, and convert a BS date locally in your browser.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <Cake className="h-5 w-5 text-rose-500" />
          <h3 className="font-bold text-slate-900">Age and date difference</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Date of birth
            <input
              type="date"
              value={birthDate}
              max={comparisonDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Compare with
            <input
              type="date"
              value={comparisonDate}
              min={birthDate}
              onChange={(event) => setComparisonDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 font-normal"
            />
          </label>
        </div>

        {age ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ['Years', age.years],
                ['Months', age.months],
                ['Days', age.days],
                ['Total days', age.totalDays.toLocaleString()]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-indigo-50 p-4 text-center">
                  <div className="text-2xl font-black text-indigo-700">{value}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p className="rounded-2xl bg-slate-50 p-4">
                Birth date in BS: <strong>{age.birthBs?.label || 'Outside supported range'}</strong>
              </p>
              <p className="rounded-2xl bg-rose-50 p-4">
                <strong>{age.nextBirthdayDays}</strong> days until the next birthday
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
            Choose a valid birth date that is not after the comparison date.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-emerald-500" />
          <h3 className="font-bold text-slate-900">BS to AD quick conversion</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['BS year', bsYear, setBsYear],
            ['BS month', bsMonth, setBsMonth],
            ['BS day', bsDay, setBsDay]
          ].map(([label, value, setter]) => (
            <label key={label} className="text-sm font-semibold text-slate-700">
              {label}
              <input
                type="number"
                min="1"
                value={value}
                onChange={handleBsChange(setter)}
                onBlur={handleInvalidConversion}
                className="mt-2 w-full rounded-2xl border px-4 py-3 font-normal"
              />
            </label>
          ))}
        </div>
        {conversionError && <p className="mt-4 text-sm text-rose-600">{conversionError}</p>}
        {convertedDate && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-800">
              {bsDay} {BS_MONTH_NAMES_EN[Number(bsMonth) - 1]} {bsYear} BS
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {convertedDate.toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
          </div>
        )}
      </section>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Dates stay in your browser and are not sent to the server.
      </p>
    </div>
  );
}
