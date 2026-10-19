/**
 * South Asian & Nepali Number-To-Words Converter
 * Supports: English NPR Words ("One Lakh Twenty Thousand Rupees Only")
 * and Nepali Devanagari ("एक लाख बीस हजार रुपैयाँ मात्र")
 */

const onesEn = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

const tensEn = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const nepaliWords = {
  0: 'शून्य', 1: 'एक', 2: 'दुई', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छ', 7: 'सात', 8: 'आठ', 9: 'नौ',
  10: 'दश', 11: 'एघार', 12: 'बाह्र', 13: 'तेह्र', 14: 'चौध', 15: 'पन्ध्र', 16: 'सोह्र', 17: 'सत्र', 18: 'अठार', 19: 'उन्नाइस',
  20: 'बीस', 21: 'एक्काइस', 22: 'बाइस', 23: 'तेइस', 24: 'चौबीस', 25: 'पच्चीस', 26: 'छब्बीस', 27: 'सत्ताइस', 28: 'अठ्ठाइस', 29: 'उनन्तिस',
  30: 'तीस', 31: 'एकत्तिस', 32: 'बत्तिस', 33: 'तेत्तिस', 34: 'चौँतिस', 35: 'पैँतिस', 36: 'छत्तीस', 37: 'सैँतिस', 38: 'अठतीस', 39: 'उनन्चालीस',
  40: 'चालीस', 41: 'एकचालीस', 42: 'बयालीस', 43: 'त्रिचालीस', 44: 'चौवालिस', 45: 'पैँतालीस', 46: 'छयालीस', 47: 'सत्चालीस', 48: 'अठचालीस', 49: 'उनन्चास',
  50: 'पचास', 51: 'एकाउन्न', 52: 'बाउन्न', 53: 'त्रिपन्न', 54: 'चौवन्न', 55: 'पचपन्न', 56: 'छपन्न', 57: 'सन्ताउन्न', 58: 'अन्ठाउन्न', 59: 'उनन्साठी',
  60: 'साठी', 61: 'एकसट्ठी', 62: 'बाइसट्ठी', 63: 'त्रिसट्ठी', 64: 'चौंसट्ठी', 65: 'पैंसट्ठी', 66: 'छयसट्ठी', 67: 'सत्सट्ठी', 68: 'अठसट्ठी', 69: 'उनन्सत्तरी',
  70: 'सत्तरी', 71: 'एकहत्तर', 72: 'बहत्तर', 73: 'त्रिहत्तर', 74: 'चौहत्तर', 75: 'पचहत्तर', 76: 'छयहत्तर', 77: 'सतहत्तर', 78: 'अठहत्तर', 79: 'उनासी',
  80: 'असी', 81: 'एकासी', 82: 'बयासी', 83: 'त्रियासी', 84: 'चौरासी', 85: 'पचासी', 86: 'छयासी', 87: 'सतासी', 88: 'अठासी', 89: 'उनान्नब्बे',
  90: 'नब्बे', 91: 'एकान्नब्बे', 92: 'बयान्नब्बे', 93: 'त्रियान्नब्बे', 94: 'चौरान्नब्बे', 95: 'पंचान्नब्बे', 96: 'छयान्नब्बे', 97: 'सन्तान्नब्बे', 98: 'अन्ठान्नब्बे', 99: 'उनान्सय'
};

function twoDigitsEn(n) {
  if (n === 0) return '';
  if (n < 20) return onesEn[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tensEn[t] + (o > 0 ? ' ' + onesEn[o] : '');
}

function threeDigitsEn(n) {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  let res = '';
  if (h > 0) {
    res += onesEn[h] + ' Hundred';
    if (rem > 0) res += ' ';
  }
  if (rem > 0) {
    res += twoDigitsEn(rem);
  }
  return res;
}

/**
 * South Asian Number system converter (Crore, Lakh, Thousand, Hundred)
 */
export function convertToNprWords(amount) {
  const num = Number(amount);
  if (isNaN(num)) return { english: 'Invalid Number', nepali: 'अमान्य संख्या' };
  if (num === 0) return { english: 'Zero Rupees Only', nepali: 'शून्य रुपैयाँ मात्र' };

  const parts = Math.abs(num).toFixed(2).split('.');
  let integerPart = parseInt(parts[0], 10);
  const paisaPart = parseInt(parts[1], 10);

  // English words decomposition
  let enWords = '';
  const crore = Math.floor(integerPart / 10000000);
  integerPart %= 10000000;

  const lakh = Math.floor(integerPart / 100000);
  integerPart %= 100000;

  const thousand = Math.floor(integerPart / 1000);
  integerPart %= 1000;

  const hundredPart = integerPart;

  if (crore > 0) {
    enWords += threeDigitsEn(crore) + ' Crore ';
  }
  if (lakh > 0) {
    enWords += twoDigitsEn(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    enWords += twoDigitsEn(thousand) + ' Thousand ';
  }
  if (hundredPart > 0) {
    enWords += threeDigitsEn(hundredPart);
  }

  enWords = enWords.trim();
  if (enWords.length === 0) {
    enWords = 'Zero';
  }

  let finalEn = `${enWords} Rupees`;
  if (paisaPart > 0) {
    finalEn += ` and ${twoDigitsEn(paisaPart)} Paisa`;
  }
  finalEn += ' Only';

  // Nepali words decomposition
  let npWords = '';
  if (crore > 0) {
    npWords += (nepaliWords[crore] || crore) + ' करोड ';
  }
  if (lakh > 0) {
    npWords += (nepaliWords[lakh] || lakh) + ' लाख ';
  }
  if (thousand > 0) {
    npWords += (nepaliWords[thousand] || thousand) + ' हजार ';
  }
  const h = Math.floor(hundredPart / 100);
  const rem = hundredPart % 100;
  if (h > 0) {
    npWords += (nepaliWords[h] || h) + ' सय ';
  }
  if (rem > 0) {
    npWords += (nepaliWords[rem] || rem) + ' ';
  }

  npWords = npWords.trim();
  let finalNp = `${npWords} रुपैयाँ`;
  if (paisaPart > 0) {
    finalNp += ` र ${nepaliWords[paisaPart] || paisaPart} पैसा`;
  }
  finalNp += ' मात्र';

  return {
    rawAmount: num,
    english: finalEn,
    nepali: finalNp,
    formattedCurrency: `NPR ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  };
}
