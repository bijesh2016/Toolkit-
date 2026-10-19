/**
 * Production-Grade Nepali Unicode Transliteration & Font Conversion Engine
 * 1. Romanized English -> Nepali Unicode (Devanagari)
 * 2. Preeti Font -> Nepali Unicode
 * 3. Nepali Unicode -> Preeti Font
 * 
 * Crafted for Bijesh Tools Hub (bijeshsharam.com.np)
 */

// ==========================================
// 1. EXTENSIVE CANONICAL NEPALI DICTIONARY
// ==========================================
export const CANONICAL_WORDS = {
  // Common Greetings & Polite Expressions
  'namaste': 'नमस्ते',
  'namaskar': 'नमस्कार',
  'dhanyabad': 'धन्यवाद',
  'dhanyabaad': 'धन्यवाद',
  'dhanyavaad': 'धन्यवाद',
  'swagatam': 'स्वागतम्',
  'swagat': 'स्वागत',
  'subhaprabhat': 'शुभप्रभात',
  'shubhaprabhat': 'शुभप्रभात',
  'subhadin': 'शुभदिन',
  'subharatri': 'शुभरात्री',
  'shubharatri': 'शुभरात्री',
  'badhai': 'बधाई',
  'shubhakamana': 'शुभकामना',
  'subhakamana': 'शुभकामना',
  'hajur': 'हजुर',
  'kripaya': 'कृपया',
  'maaf': 'माफ',
  'sanchai': 'सञ्चै',
  'aramai': 'आरामै',

  // Pronouns & Questions
  'ma': 'म',
  'mero': 'मेरो',
  'mro': 'मेरो',
  'hamro': 'हाम्रो',
  'hami': 'हामी',
  'tapai': 'तपाईं',
  'tapaiko': 'तपाईंको',
  'tapailai': 'तपाईंलाई',
  'timi': 'तिमी',
  'timro': 'तिम्रो',
  'timilai': 'तिमीलाई',
  'ta': 'तँ',
  'yo': 'यो',
  'tyo': 'त्यो',
  'yaha': 'यहाँ',
  'tyaha': 'त्यहाँ',
  'kaha': 'कहाँ',
  'yata': 'यता',
  'uta': 'उता',
  'kina': 'किन',
  'kasari': 'कसरी',
  'kahile': 'कहिल्यै',
  'kati': 'कति',
  'kasto': 'कस्तो',
  'k': 'के',
  'ke': 'के',
  'ko': 'को',
  'kasle': 'कसले',
  'kasko': 'कसको',
  'kun': 'कुन',

  // Common Verbs & Auxiliaries
  'ho': 'हो',
  'haina': 'हैन',
  'hoina': 'होइन',
  'cha': 'छ',
  'chha': 'छ',
  'chu': 'छु',
  'chhu': 'छु',
  'chaina': 'छैन',
  'chhaina': 'छैन',
  'chan': 'छन्',
  'chhan': 'छन्',
  'theyo': 'थियो',
  'thiyo': 'थियो',
  'thie': 'थिए',
  'bhayo': 'भयो',
  'bhae': 'भए',
  'bhaye': 'भए',
  'hunchha': 'हुन्छ',
  'huncha': 'हुन्छ',
  'hudaina': 'हुँदैन',
  'garnu': 'गर्नु',
  'garchhu': 'गर्छु',
  'garchu': 'गर्छु',
  'garcha': 'गर्छ',
  'gareko': 'गरेको',
  'gardai': 'गर्दै',
  'khanu': 'खानु',
  'khanchhu': 'खान्‍छु',
  'khayo': 'खायो',
  'janu': 'जानु',
  'janchhu': 'जान्छु',
  'gayo': 'गयो',
  'aaunu': 'आउनु',
  'aauchhu': 'आउँछु',
  'aayo': 'आयो',
  'dekhnu': 'देख्नु',
  'basa': 'बस',
  'basnu': 'बस्नु',
  'pokhnu': 'पोख्नु',

  // Family & Relationships
  'aama': 'आमा',
  'ama': 'आमा',
  'buwa': 'बुवा',
  'baba': 'बाबा',
  'buba': 'बुबा',
  'dai': 'दाइ',
  'didi': 'दीदी',
  'bhai': 'भाइ',
  'bahini': 'बहिनी',
  'sathi': 'साथी',
  'shrimati': 'श्रीमती',
  'shriman': 'श्रीमान्',
  'chhora': 'छोरा',
  'chhori': 'छोरी',
  'parivar': 'परिवार',

  // Time & Days
  'aaja': 'आज',
  'bholi': 'भोलि',
  'parsi': 'पर्सी',
  'hijo': 'हिजो',
  'asti': 'अस्ती',
  'aaitabar': 'आइतबार',
  'sombar': 'सोमबार',
  'mangalbar': 'मङ्गलबार',
  'budhabar': 'बुधबार',
  'bihibar': 'बिहीबार',
  'sukrabar': 'शुक्रबार',
  'sanibar': 'शनिबार',
  'din': 'दिन',
  'raat': 'रात',
  'samaya': 'समय',
  'barsa': 'वर्ष',
  'mahina': 'महिना',

  // Common Nouns & Objects
  'nepal': 'नेपाल',
  'nepali': 'नेपाली',
  'desh': 'देश',
  'naam': 'नाम',
  'nam': 'नाम',
  'ghar': 'घर',
  'pani': 'पानी',
  'bhat': 'भात',
  'khana': 'खाना',
  'chiya': 'चिया',
  'kam': 'काम',
  'kaam': 'काम',
  'kura': 'कुरा',
  'kitab': 'किताब',
  'pustak': 'पुस्तक',
  'kalam': 'कलम',
  'manchhe': 'मान्छे',
  'manche': 'मान्छे',
  'janata': 'जनता',
  'sarkar': 'सरकार',
  'sambidhan': 'संविधान',
  'samvidhan': 'संविधान',
  'bidhyalaya': 'विद्यालय',
  'vidhyalaya': 'विद्यालय',
  'vidyalaya': 'विद्यालय',
  'swasthya': 'स्वास्थ्य',
  'siksha': 'शिक्षा',
  'shiksha': 'शिक्षा',
  'bato': 'बाटो',
  'shahar': 'सहर',
  'sahar': 'सहर',
  'gau': 'गाउँ',
  'gaun': 'गाउँ',
  'maya': 'माया',
  'prem': 'प्रेम',
  'khusi': 'खुशी',
  'dukha': 'दुःख',
  'shanti': 'शान्ति',
  'samaj': 'समाज',
  'bhasha': 'भाषा',
  'itihas': 'इतिहास',
  'itihaas': 'इतिहास',
  'sanskriti': 'संस्कृति',
  'prakriti': 'प्रकृति',
  'krishna': 'कृष्ण',
  'ram': 'राम',
  'sita': 'सीता',
  'buddha': 'बुद्ध',
  'shiva': 'शिव',
  'om': 'ॐ',

  // Common Adjectives & Adverbs
  'ramro': 'राम्रो',
  'naramro': 'नराम्रो',
  'dherai': 'धेरै',
  'thorai': 'थोरै',
  'sadhai': 'सधैं',
  'sadhain': 'सधैं',
  'sanga': 'सँग',
  'sath': 'साथ',
  'satha': 'साथ',
  'aafno': 'आफ्नो',
  'afno': 'आफ्नो',
  'ani': 'अनि',
  'tara': 'तर',
  'ekdam': 'एकदम',
  'ekdamai': 'एकदमै',
  'thaha': 'थाहा',
  'raja': 'राजा',
  'rani': 'रानी',
  'katha': 'कथा',
  'bazaar': 'बजार',
  'bazar': 'बजार',

  // Geography & Nepal Cities
  'kathmandu': 'काठमाडौँ',
  'ktm': 'काठमाडौँ',
  'pokhara': 'पोखरा',
  'lalitpur': 'ललितपुर',
  'bhaktapur': 'भक्तपुर',
  'dharan': 'धरान',
  'biratnagar': 'विराटनगर',
  'birgunj': 'वीरगञ्ज',
  'butwal': 'बुटवल',
  'hetauda': 'हेटौँडा',
  'nepalgunj': 'नेपालगञ्ज',
  'dhangadhi': 'धनगढी',
  'surkhet': 'सुर्खेत',
  'janakpur': 'जनकपुर',
  'lumbini': 'लुम्बिनी',
  'chitwan': 'चितवन',
  'ilam': 'इलाम',
  'mustang': 'मुस्ताङ',
  'manang': 'मनाङ',
  'gorkha': 'गोरखा',
  'sagarmatha': 'सगरमाथा',
  'everest': 'सगरमाथा',
  'himal': 'हिमाल',
  'pahad': 'पहाड',
  'terai': 'तराई',
  'tarai': 'तराई',
  'koshi': 'कोशी',
  'madhesh': 'मधेश',
  'bagmati': 'बागमती',
  'gandaki': 'गण्डकी',
  'lumbini': 'लुम्बिनी',
  'karnali': 'कर्णाली',
  'sudurpashchim': 'सुदूरपश्चिम',

  // Bijesh Tools Hub Branding
  'bijesh': 'बिजेश',
  'sharma': 'शर्मा',
  'shrestha': 'श्रेष्ठ'
};

// ==========================================
// 2. ROMANIZED TRANSLITERATION TABLES
// ==========================================

// Independent vowels (when starting a word or following a vowel)
const INDEPENDENT_VOWELS = {
  'aa': 'आ', 'a': 'अ', 'A': 'आ',
  'ee': 'ई', 'i': 'इ', 'I': 'ई',
  'oo': 'ऊ', 'u': 'उ', 'U': 'ऊ',
  'ai': 'ऐ', 'e': 'ए', 'E': 'ए',
  'au': 'औ', 'o': 'ओ', 'O': 'ओ',
  'ri': 'ऋ', 'R': 'ऋ', 'am': 'अं', 'a~': 'अँ'
};

// Vowel signs (Matras) applied after consonants
const VOWEL_MATRAS = {
  'aa': 'ा', 'A': 'ा',
  'i': 'ि', 'ee': 'ी', 'I': 'ी',
  'u': 'ु', 'oo': 'ू', 'U': 'ू',
  'e': 'े', 'E': 'े',
  'ai': 'ै',
  'o': 'ो', 'O': 'ो',
  'au': 'ौ',
  'ri': 'ृ', 'R': 'ृ'
};

// Consonants ordered by match length (longest first)
const CONSONANTS = [
  // 4 characters
  { rom: 'chhy', uni: 'क्ष्य्' },
  { rom: 'kshy', uni: 'क्ष्य्' },

  // 3 characters
  { rom: 'chh', uni: 'छ्' },
  { rom: 'ksh', uni: 'क्ष्' },
  { rom: 'shh', uni: 'ष्' },
  { rom: 'shr', uni: 'श्र्' },
  { rom: 'dya', uni: 'द्य्' },
  { rom: 'dha', uni: 'ध्' },
  { rom: 'tra', uni: 'त्र्' },
  { rom: 'gya', uni: 'ज्ञ्' },
  { rom: 'nch', uni: 'ञ्च्' },
  { rom: 'ngh', uni: 'ङ्घ्' },

  // 2 characters
  { rom: 'kh', uni: 'ख्' },
  { rom: 'gh', uni: 'घ्' },
  { rom: 'ng', uni: 'ङ्' },
  { rom: 'ch', uni: 'च्' },
  { rom: 'jh', uni: 'झ्' },
  { rom: 'Th', uni: 'ठ्' },
  { rom: 'th', uni: 'थ्' },
  { rom: 'Dh', uni: 'ढ्' },
  { rom: 'dh', uni: 'ध्' },
  { rom: 'ph', uni: 'फ्' },
  { rom: 'bh', uni: 'भ्' },
  { rom: 'sh', uni: 'श्' },
  { rom: 'Sh', uni: 'ष्' },
  { rom: 'gy', uni: 'ज्ञ्' },
  { rom: 'tr', uni: 'त्र्' },
  { rom: 'dy', uni: 'द्य्' },
  { rom: 'nj', uni: 'ञ्' },
  { rom: 'pr', uni: 'प्र्' },
  { rom: 'kr', uni: 'क्र्' },
  { rom: 'gr', uni: 'ग्र्' },
  { rom: 'br', uni: 'ब्र्' },
  { rom: 'mr', uni: 'म्र्' },
  { rom: 'dr', uni: 'द्र्' },
  { rom: 'tt', uni: 'त्त्' },

  // 1 character
  { rom: 'k', uni: 'क्' },
  { rom: 'g', uni: 'ग्' },
  { rom: 'j', uni: 'ज्' },
  { rom: 'T', uni: 'ट्' },
  { rom: 't', uni: 'त्' },
  { rom: 'D', uni: 'ड्' },
  { rom: 'd', uni: 'द्' },
  { rom: 'N', uni: 'ण्' },
  { rom: 'n', uni: 'न्' },
  { rom: 'p', uni: 'प्' },
  { rom: 'f', uni: 'फ्' },
  { rom: 'b', uni: 'ब्' },
  { rom: 'm', uni: 'म्' },
  { rom: 'y', uni: 'य्' },
  { rom: 'r', uni: 'र्' },
  { rom: 'l', uni: 'ल्' },
  { rom: 'w', uni: 'व्' },
  { rom: 'v', uni: 'व्' },
  { rom: 's', uni: 'स्' },
  { rom: 'h', uni: 'ह्' },
  { rom: 'x', uni: 'क्ष्' }
];

const NUMBERS = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

/**
 * Transliterates a single romanized word to Devanagari Unicode
 */
export function transliterateWord(word) {
  if (!word) return '';

  const clean = word.toLowerCase();
  if (CANONICAL_WORDS[clean]) {
    return CANONICAL_WORDS[clean];
  }

  // Handle explicit halanta escapes like 'swagatam\' or 'raam_'
  const forceHalanta = word.endsWith('\\') || word.endsWith('_');
  const workingWord = forceHalanta ? word.slice(0, -1) : word;

  let i = 0;
  let result = '';
  let lastWasConsonant = false;

  while (i < workingWord.length) {
    const char = workingWord[i];

    // Numbers
    if (NUMBERS[char]) {
      result += NUMBERS[char];
      lastWasConsonant = false;
      i++;
      continue;
    }

    // Special modifier characters (Chandrabindu ~, Anusvara M/MM, Visarga :)
    if (char === '~') {
      result += 'ँ';
      lastWasConsonant = false;
      i++;
      continue;
    }
    if (char === 'M') {
      result += 'ं';
      lastWasConsonant = false;
      i++;
      continue;
    }
    if (char === ':') {
      result += 'ः';
      lastWasConsonant = false;
      i++;
      continue;
    }

    // Purna Biram
    if (char === '.' && workingWord[i + 1] === '.') {
      result += '॥';
      i += 2;
      lastWasConsonant = false;
      continue;
    }
    if (char === '.') {
      result += '।';
      i++;
      lastWasConsonant = false;
      continue;
    }

    // Consonant match check
    let matchedConsonant = null;
    for (const c of CONSONANTS) {
      if (workingWord.startsWith(c.rom, i)) {
        matchedConsonant = c;
        break;
      }
    }

    if (matchedConsonant) {
      result += matchedConsonant.uni;
      i += matchedConsonant.rom.length;
      lastWasConsonant = true;
      continue;
    }

    // Vowel match check
    let matchedVowelKey = null;
    const sub2 = workingWord.substr(i, 2);
    if (['aa', 'ee', 'oo', 'ai', 'au', 'ri'].includes(sub2)) {
      matchedVowelKey = sub2;
    } else if ('aeiouAEIOU'.includes(char)) {
      matchedVowelKey = char;
    }

    if (matchedVowelKey) {
      if (lastWasConsonant) {
        // Drop the halanta from previous consonant
        if (result.endsWith('्')) {
          result = result.slice(0, -1);
        }

        // Apply matra if not simple inherent 'a'
        if (matchedVowelKey !== 'a' && matchedVowelKey !== 'A') {
          const matra = VOWEL_MATRAS[matchedVowelKey] || VOWEL_MATRAS[matchedVowelKey.toLowerCase()];
          if (matra) {
            result += matra;
          }
        } else if (matchedVowelKey === 'aa' || matchedVowelKey === 'A') {
          result += 'ा';
        }
      } else {
        // Independent initial vowel
        const indVowel = INDEPENDENT_VOWELS[matchedVowelKey] || INDEPENDENT_VOWELS[matchedVowelKey.toLowerCase()];
        result += (indVowel || matchedVowelKey);
      }
      i += matchedVowelKey.length;
      lastWasConsonant = false;
      continue;
    }

    // Passthrough other non-alpha characters
    result += char;
    lastWasConsonant = false;
    i++;
  }

  // Nepali pronunciation rule: Terminal consonants drop halanta unless explicitly forced
  // (e.g. 'nepal' -> 'नेपाल' instead of 'नेपाल्', 'desh' -> 'देश' instead of 'देश्')
  if (!forceHalanta && result.endsWith('्') && result.length > 2) {
    result = result.slice(0, -1);
  }

  return result;
}

/**
 * Transliterates full multi-line text from Romanized English to Nepali Unicode
 */
export function romanizedToNepali(text) {
  if (!text) return '';

  // Preserve whitespace, newlines, and punctuation tokens
  const tokens = text.split(/(\s+|[.,!?:;"'()]+)/);
  return tokens.map(token => {
    if (/^\s+$/.test(token) || /^[.,!?:;"'()]+$/.test(token)) {
      if (token === '.') return '।';
      if (token === '..') return '॥';
      return token;
    }
    return transliterateWord(token);
  }).join('');
}


// ==========================================
// 3. PREETI FONT TO UNICODE CONVERTER
// ==========================================
// Gold-standard character map and post-rules based on Shuvayatra
const PREETI_CHAR_MAP = {
  "÷": "/", "v": "ख", "r": "च", "\"": "ू", "~": "ञ्", "z": "श", "ç": "ॐ", "f": "ा",
  "b": "द", "n": "ल", "j": "व", "×": "×", "V": "ख्", "R": "च्", "ß": "द्म", "^": "६",
  "Û": "!", "Z": "श्", "F": "ँ", "B": "द्य", "N": "ल्", "Ë": "ङ्ग", "J": "व्", "6": "ट",
  "2": "द्द", "¿": "रू", ">": "श्र", ":": "स्", "§": "ट्ट", "&": "७", "£": "घ्", "•": "ड्ड",
  ".": "।", "«": "्र", "*": "८", "„": "ध्र", "w": "ध", "s": "क", "g": "न", "æ": "“",
  "c": "अ", "o": "य", "k": "प", "W": "ध्", "Ö": "=", "S": "क्", "Ò": "¨", "_": ")",
  "[": "ृ", "Ú": "’", "G": "न्", "ˆ": "फ्", "C": "ऋ", "O": "इ", "Î": "ङ्ख", "K": "प्",
  "7": "ठ", "¶": "ठ्ठ", "3": "घ", "9": "ढ", "?": "रु", ";": "स", "'": "ु", "#": "३",
  "¢": "द्घ", "/": "र", "+": "ं", "ª": "ङ", "t": "त", "p": "उ", "|": "्र", "x": "ह",
  "å": "द्व", "d": "म", "`": "ञ", "l": "ि", "h": "ज", "T": "त्", "P": "ए", "Ý": "ट्ठ",
  "\\": "्", "Ù": ";", "X": "ह्", "Å": "हृ", "D": "म्", "@": "२", "Í": "ङ्क", "L": "ी",
  "H": "ज्", "4": "द्ध", "±": "+", "0": "ण्", "<": "?", "8": "ड", "¥": "र्‍", "$": "४",
  "¡": "ज्ञ्", ",": ",", "©": "र", "(": "९", "‘": "ॅ", "u": "ग", "q": "त्र", "}": "ै",
  "y": "थ", "e": "भ", "a": "ब", "i": "ष्", "‰": "झ्", "U": "ग्", "Q": "त्त", "]": "े",
  "˜": "ऽ", "Y": "थ्", "Ø": "्य", "E": "भ्", "A": "ब्", "M": "ः", "Ì": "न्न", "I": "क्ष्",
  "5": "छ", "´": "झ", "1": "ज्ञ", "°": "ङ्ढ", "=": ".", "Æ": "”", "‹": "ङ्घ", "%": "५",
  "¤": "झ्", "!": "१", "-": "(", "›": "द्र", ")": "०", "…": "‘", "Ü": "%"
};

const PREETI_POST_RULES = [
  ["्ा", ""],
  ["(त्र|त्त)([^उभप]+?)m", "$1m$2"],
  ["त्रm", "क्र"],
  ["त्तm", "क्त"],
  ["([^उभप]+?)m", "m$1"],
  ["उm", "ऊ"],
  ["भm", "झ"],
  ["पm", "फ"],
  ["इ{", "ई"],
  ["ि((.्)*[^्])", "$1ि"],
  ["(.[ािीुूृेैोौंःँ]*?){", "{$1"],
  ["((.्)*){", "{$1"],
  ["{", "र्"],
  ["([ाीुूृेैोौंःँ]+?)(्(.्)*[^्])", "$2$1"],
  ["्([ाीुूृेैोौंःँ]+?)((.्)*[^्])", "्$2$1"],
  ["([ंँ])([ािीुूृेैोौः]*)", "$2$1"],
  ["ँँ", "ँ"],
  ["ंं", "ं"],
  ["ेे", "े"],
  ["ैै", "ै"],
  ["ुु", "ु"],
  ["ूू", "ू"],
  ["^ः", ":"],
  ["टृ", "ट्ट"],
  ["ेा", "ाे"],
  ["ैा", "ाै"],
  ["अाे", "ओ"],
  ["अाै", "औ"],
  ["अा", "आ"],
  ["एे", "ऐ"],
  ["ाे", "ो"],
  ["ाै", "ौ"]
];

/**
 * Converts legacy Preeti font text to Nepali Unicode (Devanagari)
 */
export function preetiToUnicode(text) {
  if (!text) return '';

  let output = '';
  for (let w = 0; w < text.length; w++) {
    const letter = text[w];
    output += PREETI_CHAR_MAP[letter] !== undefined ? PREETI_CHAR_MAP[letter] : letter;
  }

  for (let r = 0; r < PREETI_POST_RULES.length; r++) {
    output = output.replace(new RegExp(PREETI_POST_RULES[r][0], 'g'), PREETI_POST_RULES[r][1]);
  }

  return output;
}


// ==========================================
// 4. UNICODE TO PREETI FONT CONVERTER
// ==========================================
const UNICODE_TO_PREETI_MAP = {
  // Full Vowels
  'आ': 'cf', 'ओ': 'cf]', 'औ': 'cf}', 'ऐ': 'P]', 'ई': 'O{', 'ऊ': 'pm',
  'अ': 'c', 'इ': 'O', 'उ': 'p', 'ए': 'P', 'ऋ': 'C',

  // Dependent Matras
  'ाे': 'f]', 'ाै': 'f}', 'ो': 'f]', 'ौ': 'f}',
  'े': ']', 'ै': '}', 'ा': 'f', 'ी': 'L',
  'ु': '\'', 'ू': '"', 'ृ': '[',
  'ं': '+', 'ँ': 'F', 'ः': 'M', '्': '\\',

  // Punctuation & Symbols
  '।': '.', '॥': '..', 'ॐ': 'ç', '÷': '/', '×': '×',

  // Numbers
  '०': ')', '१': '!', '२': '@', '३': '#', '४': '$',
  '५': '%', '६': '^', '७': '&', '८': '*', '९': '(',

  // Conjuncts / Special
  'ज्ञ्': '¡', 'ज्ञ': '1', 'त्र्': 'q\\', 'त्र': 'q',
  'क्ष्': 'I', 'क्ष': 'If', 'श्र': '>', 'श्र्': '>\\',
  'द्ध': '4', 'द्य': 'B', 'द्व': 'å', 'ट्ट': '§', 'ठ्ठ': '¶',
  'ड्ड': '•', 'द्र': '›', 'क्त': 'Qm', 'क्र': 'qm', 'त्त': 'Q',

  // Half Consonants (with halanta)
  'क्': 'S', 'ख्': 'V', 'ग्': 'U', 'घ्': '£', 'ङ्': 'ª\\',
  'च्': 'R', 'छ्': '5\\', 'ज्': 'H', 'झ्': '¤', 'ञ्': '~',
  'ट्': '6\\', 'ठ्': '7\\', 'ड्': '8\\', 'ढ्': '9\\', 'ण्': '0',
  'त्': 'T', 'थ्': 'Y', 'द्': 'b\\', 'ध्': 'W', 'न्': 'G',
  'प्': 'K', 'फ्': 'ˆ', 'ब्': 'A', 'भ्': 'E', 'म्': 'D',
  'य्': 'Ø', 'ल्': 'N', 'व्': 'J', 'श्': 'Z', 'ष्': 'i\\',
  'स्': ':', 'ह्': 'X',

  // Full Consonants
  'क': 's', 'ख': 'v', 'ग': 'u', 'घ': '3', 'ङ': 'ª',
  'च': 'r', 'छ': '5', 'ज': 'h', 'झ': '´', 'ञ': '`',
  'ट': '6', 'ठ': '7', 'ड': '8', 'ढ': '9', 'ण': '0f',
  'त': 't', 'थ': 'y', 'द': 'b', 'ध': 'w', 'न': 'g',
  'प': 'k', 'फ': 'm', 'ब': 'a', 'भ': 'e', 'म': 'd',
  'य': 'o', 'र': '/', 'ल': 'n', 'व': 'j',
  'श': 'z', 'ष': 'i', 'स': ';', 'ह': 'x'
};

/**
 * Converts standard Unicode Devanagari text to legacy Preeti font text
 */
export function unicodeToPreeti(text) {
  if (!text) return '';

  let str = text;

  // 1. Move reph 'र्' before consonant cluster to Preeti '{' after the cluster
  // In Unicode: 'र्म' -> 'म' + '{'
  str = str.replace(/र्([क-ह](?:्[क-ह])*)([ािीुूृेैोौँं]*)/g, '$1$2{');

  // 2. Preeti ikar 'l' (chrasva ikar) comes BEFORE the consonant cluster
  // In Unicode: 'कि' -> 'l' + 'क'
  str = str.replace(/([क-ह](?:्[क-ह])*)ि/g, 'l$1');

  // 3. Multi-character symbol conversions
  let output = '';
  let i = 0;
  const keys = Object.keys(UNICODE_TO_PREETI_MAP).sort((a, b) => b.length - a.length);

  while (i < str.length) {
    let matched = false;
    for (const key of keys) {
      if (str.startsWith(key, i)) {
        output += UNICODE_TO_PREETI_MAP[key];
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      output += str[i];
      i++;
    }
  }

  return output;
}
