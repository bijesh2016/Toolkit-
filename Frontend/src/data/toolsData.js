export const CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: 'Sparkles', color: 'text-indigo-400' },
  { id: 'nepal', name: 'Nepal Suite', icon: 'Flag', color: 'text-rose-400', count: 6 },
  { id: 'developer', name: 'Developer Tools', icon: 'Code', color: 'text-cyan-400', count: 7 },
  { id: 'document', name: 'Document & PDF', icon: 'FileText', color: 'text-amber-400', count: 6 },
  { id: 'image', name: 'Image & Design', icon: 'Image', color: 'text-emerald-400', count: 4 },
  { id: 'calculator', name: 'Calculators & Finance', icon: 'Calculator', color: 'text-purple-400', count: 4 },
  { id: 'student', name: 'Student & Education', icon: 'GraduationCap', color: 'text-blue-400', count: 3 },
  { id: 'text', name: 'Text & Writing', icon: 'Type', color: 'text-pink-400', count: 3 },
  { id: 'web-security', name: 'Web, SEO & Security', icon: 'ShieldCheck', color: 'text-teal-400', count: 10 },
  { id: 'ai', name: 'AI Mini Tools', icon: 'Cpu', color: 'text-violet-400', count: 2 }
];

export const TOOLS_LIST = [
  // Nepal Suite
  {
    id: 'bs-ad-converter',
    name: 'BS <-> AD Date Converter',
    category: 'nepal',
    icon: 'Calendar',
    badge: 'Nepal Special',
    description: 'Universal Bikram Sambat (BS) to Gregorian (AD) and AD to BS calendar converter with Devanagari weekdays, zodiac, and seasons.',
    features: ['Universal 1950 - 2100+ BS', 'Devanagari day & month output', 'Zodiac & Ritu season calculation'],
    route: '/tools/bs-ad-converter',
    popular: true
  },
  {
    id: 'nepali-unicode',
    name: 'Nepali Unicode Typing',
    category: 'nepal',
    icon: 'Keyboard',
    badge: 'Nepal Special',
    description: 'Real-time Romanized English to Nepali Devanagari phonetics converter (e.g. namaste -> नमस्ते).',
    features: ['Instant phonetic typing', 'One-click copy & download', 'Devanagari character palette'],
    route: '/tools/nepali-unicode',
    popular: true
  },
  {
    id: 'npr-to-words',
    name: 'NPR Amount to Words',
    category: 'nepal',
    icon: 'Coins',
    badge: 'Nepal Special',
    description: 'Convert Nepali currency amounts into South Asian words (Crore, Lakh, Thousand) and Nepali Devanagari.',
    features: ['Crore & Lakh formatting', 'Nepali अक्षरेपी conversion', 'Paisa decimal handling'],
    route: '/tools/npr-to-words',
    popular: true
  },
  {
    id: 'nepal-locations',
    name: 'Nepal Provinces & Districts',
    category: 'nepal',
    icon: 'MapPin',
    badge: 'Directory',
    description: 'Interactive directory of 7 Provinces, 77 Districts, Headquarters, and Postal Codes across Nepal.',
    features: ['Search by district / HQ', '7 Provinces breakdown', 'Postal codes directory'],
    route: '/tools/nepal-locations',
    popular: false
  },
  {
    id: 'nepali-invoice',
    name: 'Nepali Business Invoice',
    category: 'nepal',
    icon: 'Receipt',
    badge: 'Business',
    description: 'Generate Nepal IRD-compliant invoices with 13% VAT, PAN/VAT registration numbers, and print export.',
    features: ['13% VAT calculation', 'PAN/VAT compliance fields', 'Print & PDF export'],
    route: '/tools/nepali-invoice',
    popular: true
  },
  {
    id: 'language-translator',
    name: 'Nepali & Multi-Language Translator',
    category: 'nepal',
    icon: 'Languages',
    badge: 'Nepal + Global',
    description: 'Instant multi-language translation between Nepali, English, Hindi, Japanese, Korean, and 10+ languages with voice pronunciation and conversational phrasebook.',
    features: ['English ⇄ Nepali spotlight', 'Text-to-Speech audio pronunciation', 'Voice dictation & travel phrasebook'],
    route: '/tools/language-translator',
    popular: true
  },

  // Developer Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer',
    icon: 'FileCode2',
    badge: 'Developer',
    description: 'Format, beautify, minify, validate, and inspect JSON with detailed syntax error pointers.',
    features: ['Syntax highlighting', 'Tree view & minification', '100% Client-side privacy'],
    route: '/tools/json-formatter',
    popular: true
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Token Decoder',
    category: 'developer',
    icon: 'Key',
    badge: 'Developer',
    description: 'Decode JSON Web Tokens headers and payloads, inspect expiration dates, and never expose tokens.',
    features: ['Expiration validation', 'Claim explanations', 'Zero server transmission'],
    route: '/tools/jwt-decoder',
    popular: true
  },
  {
    id: 'base64-converter',
    name: 'Base64 & URL Toolkit',
    category: 'developer',
    icon: 'Binary',
    badge: 'Developer',
    description: 'Encode and decode Base64, URL encoding, Hexadecimal, and HTML entities seamlessly.',
    features: ['Base64 text & files', 'URL encode/decode', 'Hex converter'],
    route: '/tools/base64-converter',
    popular: false
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Matcher',
    category: 'developer',
    icon: 'Regex',
    badge: 'Developer',
    description: 'Test regular expressions against sample text in real time with match indexes and capture groups.',
    features: ['Live color highlights', 'Group captures', 'Cheat-sheet presets'],
    route: '/tools/regex-tester',
    popular: true
  },
  {
    id: 'sql-formatter',
    name: 'SQL Query Formatter',
    category: 'developer',
    icon: 'Database',
    badge: 'Developer',
    description: 'Beautify and format messy SQL queries across PostgreSQL, MySQL, SQLite, and standard SQL dialects.',
    features: ['Configurable indentation', 'Keyword uppercase toggle', 'Multi-dialect support'],
    route: '/tools/sql-formatter',
    popular: false
  },
  {
    id: 'uuid-generator',
    name: 'UUID & String Generator',
    category: 'developer',
    icon: 'Fingerprint',
    badge: 'Utility',
    description: 'Generate cryptographically random UUID v4s, random alphanumeric passwords, and secure tokens.',
    features: ['Batch generation up to 100', 'Uppercase / lowercase', 'Secure crypto API'],
    route: '/tools/uuid-generator',
    popular: false
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'developer',
    icon: 'Clock',
    badge: 'Developer',
    description: 'Convert Unix epoch timestamps (seconds & milliseconds) to human-readable dates and Nepal Time (NPT).',
    features: ['Current timestamp live', 'Local & UTC & NPT time', 'Relative time display'],
    route: '/tools/timestamp-converter',
    popular: false
  },

  // Document & PDF
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    category: 'document',
    icon: 'FileText',
    badge: 'Document',
    description: 'Count words, characters, sentences, paragraphs, reading time, and examine keyword frequency.',
    features: ['Reading time estimator', 'Keyword frequency list', 'Live text statistics'],
    route: '/tools/word-counter',
    popular: true
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    category: 'document',
    icon: 'FileUp',
    badge: 'Document',
    description: 'Convert single or multiple JPG, PNG, and WebP images into a single downloadable PDF document.',
    features: ['Multi-image merge', 'Page margin controls', '100% In-browser generation'],
    route: '/tools/image-to-pdf',
    popular: true
  },
  {
    id: 'document-scanner',
    name: 'Document Scanner & PDF Maker',
    category: 'document',
    icon: 'ScanLine',
    badge: 'New',
    description: 'Turn document photos into enhanced, ordered PDF pages with local scan filters, rotation, and drag-free page controls.',
    features: ['Original, grayscale & document filters', 'Rotate and reorder pages', 'Private in-browser PDF export'],
    route: '/tools/document-scanner',
    popular: true
  },
  {
    id: 'resume-builder',
    name: 'Modern Resume / CV Builder',
    category: 'document',
    icon: 'UserCheck',
    badge: 'Career',
    description: 'Build a sleek, ATS-friendly professional resume with real-time preview and one-click PDF print export.',
    features: ['Live interactive preview', 'Custom work & education entries', 'Print-ready styling'],
    route: '/tools/resume-builder',
    popular: true
  },
  {
    id: 'invoice-generator',
    name: 'Professional Invoice Maker',
    category: 'document',
    icon: 'DollarSign',
    badge: 'Business',
    description: 'Create clean, branded invoices and quotations with itemized line items, tax, discounts, and print styling.',
    features: ['Custom currency symbol', 'Automatic subtotals & taxes', 'Download / Print PDF'],
    route: '/tools/invoice-generator',
    popular: true
  },
  {
    id: 'certificate-maker',
    name: 'Certificate of Achievement',
    category: 'document',
    icon: 'Award',
    badge: 'Education',
    description: 'Generate high-resolution printable certificates of completion and awards from modern templates.',
    features: ['Recipient name & title', 'Multiple signature lines', 'Instant print export'],
    route: '/tools/certificate-maker',
    popular: false
  },

  // Image & Design
  {
    id: 'image-compressor',
    name: 'Image Compressor & Resizer',
    category: 'image',
    icon: 'Minimize2',
    badge: 'Design',
    description: 'Compress JPG, PNG, and WebP image files right in your browser with quality slider and instant size savings.',
    features: ['Zero file upload required', 'Dimension resizing', 'Before/After file size preview'],
    route: '/tools/image-compressor',
    popular: true
  },
  {
    id: 'qr-generator',
    name: 'Pro QR Code Studio & Designer',
    category: 'image',
    icon: 'QrCode',
    badge: 'Pro Studio',
    description: 'Create branded QR codes for Websites, WiFi auto-connect, WhatsApp direct chat, vCards, SMS, and Email with custom center logos and banners.',
    features: ['WiFi, WhatsApp, vCard & URL', 'Center logo & "SCAN ME" banner', 'Vector SVG & Ultra-HD PNG export'],
    route: '/tools/qr-generator',
    popular: true
  },
  {
    id: 'color-palette',
    name: 'Color Palette & Gradient Studio',
    category: 'image',
    icon: 'Palette',
    badge: 'Design',
    description: 'Generate vibrant color palettes, discover harmonious gradients, and copy ready-to-use CSS code.',
    features: ['Linear & radial gradients', 'CSS copy in one click', 'Random palette generator'],
    route: '/tools/color-palette',
    popular: false
  },
  {
    id: 'css-generators',
    name: 'CSS Glassmorphism & Shadows',
    category: 'image',
    icon: 'Layers',
    badge: 'Design',
    description: 'Interactive visual generator for modern UI elements: Glassmorphism, multi-layer Box Shadows, and Border Radius.',
    features: ['Live glass preview', 'Slider controls for blur & opacity', 'Clean CSS code snippet'],
    route: '/tools/css-generators',
    popular: true
  },

  // Calculators & Everyday Utilities
  {
    id: 'percentage-calculator',
    name: '3-in-1 Percentage Calculator',
    category: 'calculator',
    icon: 'Percent',
    badge: 'Calculator',
    description: 'Calculate what is X% of Y, percentage increase/decrease between two values, and fraction percentages.',
    features: ['Percentage increase / decrease', 'Fraction to percentage', 'Instant calculations'],
    route: '/tools/percentage-calculator',
    popular: true
  },
  {
    id: 'loan-emi-calculator',
    name: 'Loan EMI & Interest Calculator',
    category: 'calculator',
    icon: 'Banknote',
    badge: 'Finance',
    description: 'Calculate monthly loan EMI payments, total interest payable, and visualize the principal vs interest breakdown.',
    features: ['Monthly EMI breakdown', 'Interactive progress ratio', 'Total cost projection'],
    route: '/tools/loan-emi-calculator',
    popular: true
  },
  {
    id: 'vat-calculator',
    name: 'VAT & Tax Calculator',
    category: 'calculator',
    icon: 'CreditCard',
    badge: 'Finance',
    description: 'Quickly calculate VAT inclusive and exclusive prices with Nepal 13% standard rate or custom percentages.',
    features: ['VAT inclusive & exclusive', 'Discount + VAT calculation', 'Configurable tax percentage'],
    route: '/tools/vat-calculator',
    popular: false
  },
  {
    id: 'age-calculator',
    name: 'Age & Date Difference',
    category: 'calculator',
    icon: 'Hourglass',
    badge: 'Utility',
    description: 'Calculate exact age in years, months, days, total hours, and days remaining until your next birthday.',
    features: ['Exact years, months & days', 'Next birthday countdown', 'Total days lived'],
    route: '/tools/age-calculator',
    popular: false
  },

  // Student & Education
  {
    id: 'gpa-calculator',
    name: 'GPA & CGPA Calculator',
    category: 'student',
    icon: 'GraduationCap',
    badge: 'Student',
    description: 'Calculate semester Grade Point Average (GPA) and Cumulative CGPA using standard 4.0 grading scales.',
    features: ['Custom course rows & credits', 'Letter grade mapping', 'Cumulative CGPA calculation'],
    route: '/tools/gpa-calculator',
    popular: true
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Study Timer',
    category: 'student',
    icon: 'Timer',
    badge: 'Focus',
    description: 'Boost focus and productivity with customizable Pomodoro sessions, short/long breaks, and session counters.',
    features: ['25m work / 5m break presets', 'Audio notification bells', 'Completed rounds counter'],
    route: '/tools/pomodoro-timer',
    popular: false
  },
  {
    id: 'flashcard-maker',
    name: 'Study Flashcard Deck',
    category: 'student',
    icon: 'BookOpen',
    badge: 'Student',
    description: 'Create, shuffle, and study digital flashcards with smooth 3D flip card animations for exam prep.',
    features: ['Interactive 3D flip effect', 'Add/edit cards on the fly', 'Mastery progress tracking'],
    route: '/tools/flashcard-maker',
    popular: false
  },

  // Text & Writing
  {
    id: 'case-converter',
    name: 'Text Case Transformer',
    category: 'text',
    icon: 'Type',
    badge: 'Text',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, and snake_case.',
    features: ['7 transformation formats', 'Clean extra spaces', 'One-click copy'],
    route: '/tools/case-converter',
    popular: true
  },
  {
    id: 'text-diff',
    name: 'Text & Code Diff Checker',
    category: 'text',
    icon: 'GitCompare',
    badge: 'Developer',
    description: 'Compare two text or code snippets side-by-side with line-by-line visual additions and deletions.',
    features: ['Side-by-side & inline views', 'Highlight additions & removals', 'Character-level precision'],
    route: '/tools/text-diff',
    popular: false
  },
  {
    id: 'slug-generator',
    name: 'SEO URL Slug Generator',
    category: 'text',
    icon: 'Link',
    badge: 'SEO',
    description: 'Generate clean, URL-safe SEO slugs with customizable separators and lowercasing.',
    features: ['Remove special characters', 'Custom hyphen/underscore', 'Strict SEO format'],
    route: '/tools/slug-generator',
    popular: false
  },

  // Web, SEO & Security
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag & OpenGraph Studio',
    category: 'web-security',
    icon: 'Share2',
    badge: 'SEO',
    description: 'Generate Google SEO, Open Graph (Facebook), and Twitter Card meta tags with live social share cards.',
    features: ['Live Google SERP preview', 'Twitter / Facebook card preview', 'Copy HTML tags'],
    route: '/tools/meta-tag-generator',
    popular: true
  },
  {
    id: 'robots-sitemap',
    name: 'Robots.txt & Sitemap Generator',
    category: 'web-security',
    icon: 'FileCode',
    badge: 'SEO',
    description: 'Generate valid robots.txt directives and XML sitemap structures for search engine crawlers.',
    features: ['Googlebot & Bingbot presets', 'XML sitemap builder', 'Download .txt / .xml'],
    route: '/tools/robots-sitemap',
    popular: false
  },
  {
    id: 'url-inspector',
    name: 'SSRF-Safe Website Header Inspector',
    category: 'web-security',
    icon: 'Globe',
    badge: 'Backend API',
    description: 'Inspect HTTP response headers, SSL status, response latency, and Open Graph tags safely.',
    features: ['Enterprise SSRF protection', 'Response latency check', 'Security headers audit'],
    route: '/tools/url-inspector',
    popular: true
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    category: 'web-security',
    icon: 'Lock',
    badge: 'Security',
    description: 'Generate strong cryptographically secure passwords with entropy estimation and zero transmission.',
    features: ['Entropy score in bits', 'Pronounceable passphrase option', 'Symbols & numbers control'],
    route: '/tools/password-generator',
    popular: true
  },
  {
    id: 'hash-generator',
    name: 'Hash & Checksum Generator',
    category: 'web-security',
    icon: 'Hash',
    badge: 'Security',
    description: 'Calculate cryptographic hash checksums including MD5, SHA-1, SHA-256, and SHA-512 instantly.',
    features: ['Multiple hash algorithms', 'HMAC key support', 'Zero server storage'],
    route: '/tools/hash-generator',
    popular: false
  },
  {
    id: 'secret-redactor',
    name: 'Sensitive Secret Redactor',
    category: 'web-security',
    icon: 'ShieldAlert',
    badge: 'Security',
    description: 'Scan pasted documents and code to detect and redact API keys, AWS credentials, JWTs, and credit card numbers.',
    features: ['Auto-detects credentials', 'Safe masked output', 'Local privacy check'],
    route: '/tools/secret-redactor',
    popular: true
  },
  {
    id: 'temp-email',
    name: 'Free Disposable Email & OTP Inbox',
    category: 'web-security',
    icon: 'Mail',
    badge: 'Privacy & Inbox',
    description: 'Instant disposable temporary mailboxes with a separate live inbox section to sign up anywhere and auto-detect OTP verification codes.',
    features: ['Dedicated live inbox & auto-refresh', 'Auto-detect & 1-click copy OTP', '2 Free Inboxes + Pro upgrade'],
    route: '/tools/temp-email',
    popular: true
  },
  {
    id: 'media-downloader',
    name: 'Universal Video & MP3 Downloader',
    category: 'web-security',
    icon: 'Video',
    badge: 'HD & 4K Pro',
    description: 'Download high-definition MP4 videos and extracted MP3 audio from YouTube, TikTok, Vimeo, and web streams with resolution selection (360p to 4K Ultra) and Pro audio.',
    features: ['YouTube, TikTok, Vimeo & URLs', 'MP4 video (360p to 4K Ultra HD)', 'MP3 audio extract (128k to 320k Pro)'],
    route: '/tools/media-downloader',
    popular: true
  },
  {
    id: 'playlist-downloader',
    name: 'YouTube Playlist Downloader',
    category: 'web-security',
    icon: 'ListMusic',
    badge: 'Bulk MP4 & MP3',
    description: 'Batch download entire YouTube playlists with custom video resolutions (360p to 4K Ultra), 320kbps MP3 audio extraction, and .M3U / .txt export.',
    features: ['1-Click Batch queue downloads', 'MP4 video (720p Free, 1080p/4K Pro)', 'Export .M3U for VLC & txt links'],
    route: '/tools/playlist-downloader',
    popular: true
  },

  // AI Mini Tools
  {
    id: 'ai-summarizer',
    name: 'AI Document Summarizer',
    category: 'ai',
    icon: 'Sparkles',
    badge: 'AI Powered',
    description: 'Summarize long articles and notes into executive summaries, bullet points, and extracted action items.',
    features: ['Executive summary & bullet points', 'Action items extraction', 'Reading time reduction'],
    route: '/tools/ai-summarizer',
    popular: true
  },
  {
    id: 'ai-code-explainer',
    name: 'AI Code & Error Explainer',
    category: 'ai',
    icon: 'Cpu',
    badge: 'AI Powered',
    description: 'Explain code snippets, identify algorithmic time complexity, and diagnose runtime stack traces.',
    features: ['Step-by-step breakdown', 'Big-O time complexity', 'Bug & fix recommendations'],
    route: '/tools/ai-code-explainer',
    popular: true
  }
];
