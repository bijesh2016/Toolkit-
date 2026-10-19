/**
 * Comprehensive Nepal Geographic and Reference Data
 * 7 Provinces, 77 Districts, Headquarters, Postal codes, Festivals & Tax info
 */

export const NEPAL_PROVINCES = [
  {
    id: 1,
    name: 'Koshi Province',
    nameNp: 'कोशी प्रदेश',
    capital: 'Biratnagar',
    districtsCount: 14,
    districts: [
      { name: 'Bhojpur', hq: 'Bhojpur', postalCode: '57000' },
      { name: 'Dhankuta', hq: 'Dhankuta', postalCode: '56900' },
      { name: 'Ilam', hq: 'Ilam', postalCode: '57300' },
      { name: 'Jhapa', hq: 'Bhadrapur', postalCode: '57200' },
      { name: 'Khotang', hq: 'Diktel', postalCode: '56200' },
      { name: 'Morang', hq: 'Biratnagar', postalCode: '56600' },
      { name: 'Okhaldhunga', hq: 'Okhaldhunga', postalCode: '56100' },
      { name: 'Panchthar', hq: 'Phidim', postalCode: '57400' },
      { name: 'Sankhuwasabha', hq: 'Khandbari', postalCode: '56800' },
      { name: 'Solukhumbu', hq: 'Salleri', postalCode: '56000' },
      { name: 'Sunsari', hq: 'Inaruwa', postalCode: '56700' },
      { name: 'Taplejung', hq: 'Fungling', postalCode: '57500' },
      { name: 'Terhathum', hq: 'Myanglung', postalCode: '57100' },
      { name: 'Udayapur', hq: 'Gaighat', postalCode: '56300' }
    ]
  },
  {
    id: 2,
    name: 'Madhesh Province',
    nameNp: 'मधेश प्रदेश',
    capital: 'Janakpur',
    districtsCount: 8,
    districts: [
      { name: 'Bara', hq: 'Kalaiya', postalCode: '44400' },
      { name: 'Dhanusha', hq: 'Janakpur', postalCode: '45600' },
      { name: 'Mahottari', hq: 'Jaleshwar', postalCode: '45700' },
      { name: 'Parsa', hq: 'Birgunj', postalCode: '44300' },
      { name: 'Rautahat', hq: 'Gaur', postalCode: '44500' },
      { name: 'Saptari', hq: 'Rajbiraj', postalCode: '56400' },
      { name: 'Sarlahi', hq: 'Malangwa', postalCode: '45800' },
      { name: 'Siraha', hq: 'Siraha', postalCode: '56500' }
    ]
  },
  {
    id: 3,
    name: 'Bagmati Province',
    nameNp: 'बागमती प्रदेश',
    capital: 'Hetauda',
    districtsCount: 13,
    districts: [
      { name: 'Bhaktapur', hq: 'Bhaktapur', postalCode: '44800' },
      { name: 'Chitwan', hq: 'Bharatpur', postalCode: '44200' },
      { name: 'Dhading', hq: 'Dhading Besi', postalCode: '45100' },
      { name: 'Dolakha', hq: 'Charikot', postalCode: '45500' },
      { name: 'Kathmandu', hq: 'Kathmandu', postalCode: '44600' },
      { name: 'Kavrepalanchok', hq: 'Dhulikhel', postalCode: '45200' },
      { name: 'Lalitpur', hq: 'Patan', postalCode: '44700' },
      { name: 'Makwanpur', hq: 'Hetauda', postalCode: '44100' },
      { name: 'Nuwakot', hq: 'Bidur', postalCode: '44900' },
      { name: 'Ramechhap', hq: 'Manthali', postalCode: '45400' },
      { name: 'Rasuwa', hq: 'Dhunche', postalCode: '45000' },
      { name: 'Sindhuli', hq: 'Sindhulimadi', postalCode: '45900' },
      { name: 'Sindhupalchok', hq: 'Chautara', postalCode: '45300' }
    ]
  },
  {
    id: 4,
    name: 'Gandaki Province',
    nameNp: 'गण्डकी प्रदेश',
    capital: 'Pokhara',
    districtsCount: 11,
    districts: [
      { name: 'Baglung', hq: 'Baglung', postalCode: '33300' },
      { name: 'Gorkha', hq: 'Gorkha', postalCode: '34000' },
      { name: 'Kaski', hq: 'Pokhara', postalCode: '33700' },
      { name: 'Lamjung', hq: 'Besisahar', postalCode: '33600' },
      { name: 'Manang', hq: 'Chame', postalCode: '33500' },
      { name: 'Mustang', hq: 'Jomsom', postalCode: '33100' },
      { name: 'Myagdi', hq: 'Beni', postalCode: '33200' },
      { name: 'Nawalpur (Nawalparasi East)', hq: 'Kawasoti', postalCode: '33000' },
      { name: 'Parbat', hq: 'Kusma', postalCode: '33400' },
      { name: 'Syangja', hq: 'Putalibazar', postalCode: '33800' },
      { name: 'Tanahun', hq: 'Damauli', postalCode: '33900' }
    ]
  },
  {
    id: 5,
    name: 'Lumbini Province',
    nameNp: 'लुम्बिनी प्रदेश',
    capital: 'Deukhuri (Dang)',
    districtsCount: 12,
    districts: [
      { name: 'Arghakhanchi', hq: 'Sandhikharka', postalCode: '32700' },
      { name: 'Banke', hq: 'Nepalgunj', postalCode: '21900' },
      { name: 'Bardiya', hq: 'Gulariya', postalCode: '21800' },
      { name: 'Dang', hq: 'Ghorahi', postalCode: '22400' },
      { name: 'Gulmi', hq: 'Tamghas', postalCode: '32600' },
      { name: 'Kapilvastu', hq: 'Taulihawa', postalCode: '32800' },
      { name: 'Parasi (Nawalparasi West)', hq: 'Ramgram', postalCode: '33007' },
      { name: 'Palpa', hq: 'Tansen', postalCode: '32500' },
      { name: 'Pyuthan', hq: 'Pyuthan Khalanga', postalCode: '22300' },
      { name: 'Rolpa', hq: 'Liwang', postalCode: '22100' },
      { name: 'Eastern Rukum', hq: 'Rukumkot', postalCode: '22000' },
      { name: 'Rupandehi', hq: 'Siddharthanagar (Bhairahawa)', postalCode: '32900' }
    ]
  },
  {
    id: 6,
    name: 'Karnali Province',
    nameNp: 'कर्णाली प्रदेश',
    capital: 'Birendranagar (Surkhet)',
    districtsCount: 10,
    districts: [
      { name: 'Dailekh', hq: 'Dullu', postalCode: '21600' },
      { name: 'Dolpa', hq: 'Dunai', postalCode: '21400' },
      { name: 'Humla', hq: 'Simikot', postalCode: '21200' },
      { name: 'Jajarkot', hq: 'Khalanga', postalCode: '21500' },
      { name: 'Jumla', hq: 'Khalanga', postalCode: '21300' },
      { name: 'Kalikot', hq: 'Manma', postalCode: '21700' },
      { name: 'Mugu', hq: 'Gamgadhi', postalCode: '21100' },
      { name: 'Salyan', hq: 'Salyan Khalanga', postalCode: '22200' },
      { name: 'Surkhet', hq: 'Birendranagar', postalCode: '21700' },
      { name: 'Western Rukum', hq: 'Musikot', postalCode: '22000' }
    ]
  },
  {
    id: 7,
    name: 'Sudurpashchim Province',
    nameNp: 'सुदूरपश्चिम प्रदेश',
    capital: 'Godawari (Kailali)',
    districtsCount: 9,
    districts: [
      { name: 'Achham', hq: 'Mangalsen', postalCode: '10700' },
      { name: 'Baitadi', hq: 'Dasharathchand', postalCode: '10200' },
      { name: 'Bajhang', hq: 'Chainpur', postalCode: '10500' },
      { name: 'Bajura', hq: 'Martadi', postalCode: '10600' },
      { name: 'Dadeldhura', hq: 'Amargadhi', postalCode: '10300' },
      { name: 'Darchula', hq: 'Darchula Khalanga', postalCode: '10100' },
      { name: 'Doti', hq: 'Dipayal Silgadhi', postalCode: '10400' },
      { name: 'Kailali', hq: 'Dhangadhi', postalCode: '10900' },
      { name: 'Kanchanpur', hq: 'Bhimdatta (Mahendranagar)', postalCode: '10800' }
    ]
  }
];

export const NEPAL_FESTIVALS = [
  { name: 'Dashain (Vijaya Dashami)', nepali: 'बडा दशैं', bsMonth: 'Ashwin / Kartik', significance: 'Victory of good over evil, blessings from elders with Tika & Jamara.' },
  { name: 'Tihar (Deepawali & Bhai Tika)', nepali: 'तिहार / यमपञ्चक', bsMonth: 'Kartik', significance: 'Festival of lights, worship of Crow, Dog, Cow, Laxmi Puja, Govardhan Puja, and Bhai Tika.' },
  { name: 'Chhath Puja', nepali: 'छठ पर्व', bsMonth: 'Kartik', significance: 'Worship of the Sun God, popular in Terai and across Nepal.' },
  { name: 'Holi (Fagu Purnima)', nepali: 'फागु पूर्णिमा (होली)', bsMonth: 'Falgun', significance: 'Celebration of colors, joy, spring arrival.' },
  { name: 'Maha Shivaratri', nepali: 'महाशिवरात्रि', bsMonth: 'Falgun', significance: 'Pashupatinath celebration, prayers and vigil for Lord Shiva.' },
  { name: 'Buddha Jayanti', nepali: 'बुद्ध जयन्ती', bsMonth: 'Baishakh', significance: 'Birth, enlightenment, and parinirvana of Gautama Buddha at Lumbini.' },
  { name: 'Teej (Haritalika Teej)', nepali: 'हरितालिका तीज', bsMonth: 'Bhadra', significance: 'Celebration by Hindu women for family prosperity, fasting, and red attire.' },
  { name: 'Maghe Sankranti', nepali: 'माघे संक्रान्ति', bsMonth: 'Magh 1', significance: 'Winter solstice celebration, eating Til ko laddu, Ghee, Chaku, and Tarul.' },
  { name: 'Lhosar (Sonam / Tamu / Gyalpo)', nepali: 'ल्होसार', bsMonth: 'Poush - Falgun', significance: 'New Year celebration for Gurung, Tamang, and Sherpa communities.' }
];

export const NEPAL_TAX_INFO = {
  vatRate: 0.13, // 13% Standard VAT
  vatDescription: 'Standard Value Added Tax in Nepal is 13% administered by Inland Revenue Department (IRD).',
  tdsRates: [
    { type: 'House Rent', rate: '10% (Local Government) / 10%' },
    { type: 'Service Fee (VAT Registered Entity)', rate: '1.5%' },
    { type: 'Service Fee (Non-VAT Registered / Individual)', rate: '15%' },
    { type: 'Bank Interest (Individual)', rate: '5%' },
    { type: 'Meeting Allowance', rate: '15%' },
    { type: 'Consultancy / Professional Services', rate: '15%' }
  ],
  currency: 'NPR',
  symbol: 'रू'
};
