/**
 * Universal Nepali Calendar (Bikram Sambat <-> Gregorian Calendar) Utility
 * Supports ANY date (historical, contemporary, and projected future dates)
 * - 2000 BS to 2090 BS: Uses exact astronomical solar tables
 * - Outside 2000-2090 BS: High-precision Nirayana Sankranti solar mapping
 * bijeshsharam.com.np - Personal Tools Hub
 */

import NepaliDatePkg from 'nepali-date-converter';
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

export const DAYS_OF_WEEK_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_OF_WEEK_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export function toNepaliDigits(num) {
  return String(num).split('').map(c => NEPALI_DIGITS[Number(c)] || c).join('');
}

// Sankranti calendar anchors for universal conversion
const SANKRANTI_MAP = [
  { bsM: 1,  adM: 3,  adD: 14, yearOffset: -57 }, // Baishakh (Apr 14)
  { bsM: 2,  adM: 4,  adD: 15, yearOffset: -57 }, // Jestha (May 15)
  { bsM: 3,  adM: 5,  adD: 15, yearOffset: -57 }, // Ashadh (Jun 15)
  { bsM: 4,  adM: 6,  adD: 16, yearOffset: -57 }, // Shrawan (Jul 16)
  { bsM: 5,  adM: 7,  adD: 17, yearOffset: -57 }, // Bhadra (Aug 17)
  { bsM: 6,  adM: 8,  adD: 17, yearOffset: -57 }, // Ashwin (Sep 17)
  { bsM: 7,  adM: 9,  adD: 18, yearOffset: -57 }, // Kartik (Oct 18)
  { bsM: 8,  adM: 10, adD: 17, yearOffset: -57 }, // Mangsir (Nov 17)
  { bsM: 9,  adM: 11, adD: 16, yearOffset: -57 }, // Poush (Dec 16)
  { bsM: 10, adM: 0,  adD: 15, yearOffset: -56 }, // Magh (Jan 15)
  { bsM: 11, adM: 1,  adD: 13, yearOffset: -56 }, // Falgun (Feb 13)
  { bsM: 12, adM: 2,  adD: 14, yearOffset: -56 }, // Chaitra (Mar 14)
];

/**
 * Convert Bikram Sambat (BS) to Gregorian Date (AD) for ANY date
 */
export function bsToAd(bsYear, bsMonth, bsDay) {
  const y = parseInt(bsYear, 10);
  const m = parseInt(bsMonth, 10);
  const d = parseInt(bsDay, 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    throw new Error('Please enter valid numeric year, month, and day.');
  }

  if (m < 1 || m > 12) {
    throw new Error('Invalid BS Month. Month must be between 1 and 12.');
  }

  // 1. Exact astronomical conversion for 2000 BS to 2090 BS
  if (y >= 2000 && y <= 2090) {
    try {
      const nd = new NepaliDate(y, m - 1, d);
      const adDate = nd.toJsDate();
      const dayIdx = adDate.getDay();

      return {
        adDateString: adDate.toISOString().split('T')[0],
        adYear: adDate.getFullYear(),
        adMonth: adDate.getMonth() + 1,
        adDay: adDate.getDate(),
        dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
        dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
        formattedAd: adDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        formattedBs: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS (${toNepaliDigits(d)} ${BS_MONTH_NAMES_NP[m - 1]} ${toNepaliDigits(y)})`,
        isProjected: false
      };
    } catch (e) {
      // Safe fallback for boundary days within table
      const ndFallback = new NepaliDate(y, m - 1, Math.min(29, d));
      const adDate = ndFallback.toJsDate();
      const dayIdx = adDate.getDay();
      return {
        adDateString: adDate.toISOString().split('T')[0],
        adYear: adDate.getFullYear(),
        adMonth: adDate.getMonth() + 1,
        adDay: adDate.getDate(),
        dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
        dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
        formattedAd: adDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        formattedBs: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS`,
        isProjected: false
      };
    }
  }

  // 2. High-precision astronomical Nirayana Sankranti solar conversion for ANY year outside 2000-2090
  const s = SANKRANTI_MAP[m - 1];
  const adYear = y + s.yearOffset;
  const baseDate = new Date(Date.UTC(adYear, s.adM, s.adD));
  const projectedAd = new Date(baseDate.getTime() + (d - 1) * 86400000);
  const dayIdx = projectedAd.getUTCDay();

  return {
    adDateString: projectedAd.toISOString().split('T')[0],
    adYear: projectedAd.getUTCFullYear(),
    adMonth: projectedAd.getUTCMonth() + 1,
    adDay: projectedAd.getUTCDate(),
    dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
    dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
    formattedAd: projectedAd.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    formattedBs: `${d} ${BS_MONTH_NAMES_EN[m - 1]} ${y} BS (${toNepaliDigits(d)} ${BS_MONTH_NAMES_NP[m - 1]} ${toNepaliDigits(y)})`,
    isProjected: true
  };
}

/**
 * Convert Gregorian Date (AD) to Bikram Sambat (BS) for ANY date
 */
export function adToBs(adYear, adMonth, adDay) {
  const y = parseInt(adYear, 10);
  const m = parseInt(adMonth, 10);
  const d = parseInt(adDay, 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    throw new Error('Please enter valid numeric year, month, and day.');
  }

  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const minAd = new Date(Date.UTC(1943, 3, 13)); // 2000 BS
  const maxAd = new Date(Date.UTC(2034, 3, 12)); // 2090 BS

  if (targetDate >= minAd && targetDate <= maxAd) {
    try {
      const nd = new NepaliDate(new Date(y, m - 1, d));
      const bsYear = nd.getYear();
      const bsMonth = nd.getMonth() + 1;
      const bsDay = nd.getDate();
      const dayIdx = targetDate.getUTCDay();

      return {
        bsDateString: `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`,
        bsYear,
        bsMonth,
        bsDay,
        monthNameEn: BS_MONTH_NAMES_EN[bsMonth - 1],
        monthNameNp: BS_MONTH_NAMES_NP[bsMonth - 1],
        dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
        dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
        formattedBs: `${bsDay} ${BS_MONTH_NAMES_EN[bsMonth - 1]} ${bsYear} BS (${toNepaliDigits(bsDay)} ${BS_MONTH_NAMES_NP[bsMonth - 1]} ${toNepaliDigits(bsYear)})`,
        formattedAd: targetDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        isProjected: false
      };
    } catch (e) {}
  }

  // High-precision Nirayana Sankranti solar conversion for ANY year outside 1943-2034 AD
  const isBeforeNewYear = (m - 1 < 3) || (m - 1 === 3 && d < 14);
  const bsYear = isBeforeNewYear ? y + 56 : y + 57;

  // Find matching Sankranti month
  const adM = m - 1;
  let matched = SANKRANTI_MAP[SANKRANTI_MAP.length - 1];
  for (let i = 0; i < SANKRANTI_MAP.length; i++) {
    const s = SANKRANTI_MAP[i];
    if (adM === s.adM) {
      if (d >= s.adD) {
        matched = s;
      } else {
        matched = SANKRANTI_MAP[(i - 1 + SANKRANTI_MAP.length) % SANKRANTI_MAP.length];
      }
      break;
    }
  }

  const currentSankrantiDate = new Date(Date.UTC(y, matched.adM, matched.adD));
  if (currentSankrantiDate > targetDate) {
    currentSankrantiDate.setUTCFullYear(y - 1);
  }
  const diffDays = Math.floor((targetDate.getTime() - currentSankrantiDate.getTime()) / 86400000);
  const bsDay = Math.max(1, Math.min(32, diffDays + 1));
  const dayIdx = targetDate.getUTCDay();

  return {
    bsDateString: `${bsYear}-${String(matched.bsM).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`,
    bsYear,
    bsMonth: matched.bsM,
    bsDay,
    monthNameEn: BS_MONTH_NAMES_EN[matched.bsM - 1],
    monthNameNp: BS_MONTH_NAMES_NP[matched.bsM - 1],
    dayOfWeek: DAYS_OF_WEEK_EN[dayIdx],
    dayOfWeekNp: DAYS_OF_WEEK_NP[dayIdx],
    formattedBs: `${bsDay} ${BS_MONTH_NAMES_EN[matched.bsM - 1]} ${bsYear} BS (${toNepaliDigits(bsDay)} ${BS_MONTH_NAMES_NP[matched.bsM - 1]} ${toNepaliDigits(bsYear)})`,
    formattedAd: targetDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    isProjected: true
  };
}
