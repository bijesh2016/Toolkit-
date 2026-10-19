# Bijesh Tools Hub (Free Online Tools Platform)
> Personal-Branded Online Utility Suite by **Bijesh Sharma** ([bijeshsharam.com.np](https://bijeshsharam.com.np))

[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0-green.svg)](http://localhost:5000/api/docs)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](#docker-deployment)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)](#privacy-first-architecture)
[![Nepal Suite](https://img.shields.io/badge/Nepal-Suite%20%F0%9F%87%B3%F0%9F%87%B5-crimson.svg)](#1-nepal-localization-suite-)

A unified, modern online tools platform where students, developers, freelancers, creators, and small businesses can access free, privacy-preserving utilities without installing native software.

---

## 🚀 Key Features & Tool Suites

### 1. Nepal Localization Suite 🇳🇵
- **BS <-> AD Date Converter**: High-precision Bikram Sambat (2070 - 2090 BS) to Gregorian (AD) calendar converter with Devanagari weekdays and month names.
- **Nepali Unicode Typing**: Real-time phonetic Romanized transliteration (e.g. `namaste` ➔ `नमस्ते`) with quick character palette and `.txt` export.
- **NPR Amount to Words**: Converts currency numbers to South Asian words (Crore, Lakh, Thousand) and Nepali Devanagari अक्षरेपी for bank checks and receipts.
- **7 Provinces & 77 Districts Directory**: Interactive directory with headquarters and postal codes across Nepal.
- **Nepali Business Tax Invoice**: IRD-compliant bill generator with 13% VAT, PAN/VAT formatting, and print-ready layout.

### 2. Developer Suite
- **JSON Formatter & Validator**: Beautify (2/4 spaces), minify, and validate JSON syntax with error pointers.
- **JWT Decoder**: Inspect headers, payloads, and expiration timestamps with zero server transmission.
- **Base64 & URL Toolkit**: Base64, URL encoding, Hexadecimal, and HTML entity converters.
- **Regex Tester**: Real-time match highlighting, capture groups, and common pattern presets.
- **SQL Query Formatter**: Multi-dialect SQL formatter (PostgreSQL, MySQL, SQLite) with UPPERCASE keywords.
- **UUID & String Generator**: Cryptographic UUID v4 and random token generator with batch output.
- **Unix Timestamp Converter**: Epoch seconds and milliseconds to UTC, Local Time, and Nepal Time (NPT UTC+5:45).

### 3. Document & PDF Suite
- **Word & Character Counter**: Words, characters, reading time, and keyword frequency analyzer.
- **Image to PDF**: Combine multiple JPG, PNG, and WebP images into a single PDF document in your browser.
- **ATS Resume / CV Builder**: Professional resume builder with live preview and print/PDF export.
- **Global Invoice Maker**: Multi-currency invoices with customizable taxes and line items.
- **Certificate Maker**: Printable certificates of completion with custom titles and signatures.

### 4. Image & Design Suite
- **Image Compressor & Resizer**: Browser-side JPEG/PNG compression with quality slider and file size savings indicator.
- **Custom QR Code Generator**: High-resolution QR generator with foreground/background colors and PNG export.
- **Color Palette & Gradient Studio**: Vibrant gradient generator with one-click CSS copy.
- **CSS Glassmorphism & Shadow Designer**: Visual CSS generator for modern frosted glass and multi-layer shadows.

### 5. Calculators & Finance Suite
- **3-in-1 Percentage Calculator**: X% of Y, percentage increase/decrease, and proportions.
- **Loan EMI Calculator**: Monthly EMI calculation, total interest breakdown, and visual loan-to-interest progress ratio.
- **VAT & Tax Calculator**: Add or extract 13% standard Nepal VAT with discount support.
- **Age & Date Difference**: Exact age in years, months, days, total hours, and next birthday countdown.

### 6. Student & Education Suite
- **GPA & CGPA Calculator**: Semester GPA and Cumulative CGPA on a standard 4.0 grading scale.
- **Pomodoro Study Timer**: 25m work / 5m break study timer with synthesized audio bells.
- **Study Flashcard Deck**: Interactive 3D flip card memory trainer with custom card creation.

### 7. Text & Writing Suite
- **Text Case Transformer**: UPPERCASE, lowercase, Title Case, camelCase, kebab-case, snake_case.
- **Text & Code Diff Checker**: Line-by-line visual difference comparator.
- **SEO URL Slug Generator**: URL-safe permalink generator with custom separators.

### 8. Web, SEO & Security Suite
- **Meta Tag & OpenGraph Studio**: Google SERP, Facebook, and Twitter card previews with HTML meta tags.
- **Robots.txt & XML Sitemap Generator**: Downloadable crawler directive files.
- **SSRF-Safe Website Header Inspector**: Backend API analyzing status code, latency, server headers, and OpenGraph tags.
- **Cryptographic Password Generator**: Password entropy scoring (bits) and brute-force crack time estimates.
- **Hash Checksum Generator**: MD5, SHA-1, SHA-256, and SHA-512 calculation.
- **Sensitive Secret Redactor**: Detects and redacts AWS access keys, GitHub tokens, JWTs, and credit cards.

### 9. AI Mini Tools
- **AI Document Summarizer**: Executive summary, key insights bullet points, and action items extraction.
- **AI Code & Error Explainer**: Algorithmic Big-O time complexity estimation and stack trace diagnostics.

---

## 🛠 Technology Stack

- **Frontend**:
  - React 19 (using JSX)
  - Vite 8
  - Tailwind CSS 3
  - React Router DOM 7
  - Lucide React Icons
  - jsPDF & Canvas Confetti & QRCode
- **Backend**:
  - Node.js 20+ & Express.js
  - Swagger UI & OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`)
  - SSRF-Safe URL Inspector & DNS Resolver
  - Express Rate Limiter & Helmet Security
  - Cryptographic & Nepali Astronomical Calendar Engines
- **Containerization**:
  - Docker & Docker Compose
  - Multi-stage Nginx production build

---

## 🐳 Docker Deployment

To spin up both Frontend and Backend with automated health checks:

```bash
# Build and launch containers
docker compose up --build -d

# View status
docker compose ps
```

- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

To stop services:
```bash
docker compose down
```

---

## 💻 Local Development Setup

### 1. Start Backend
```bash
cd Backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000` with Swagger documentation at `http://localhost:5000/api/docs`.

### 2. Start Frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000` with automated proxying to the Backend API.

---

## 🔒 Privacy & SSRF Protection Architecture

1. **Zero Retention Policy**: JSON data, JWT tokens, images, and passwords are never transmitted or stored on any server.
2. **Server-Side Request Forgery (SSRF) Guard**: The Website Header Inspector resolves hostnames via DNS and blocks all loopback (`127.0.0.0/8`), private RFC1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata IP ranges (`169.254.169.254`).

---

## 👤 Author & Brand

- **Creator**: Bijesh Sharma
- **Personal Website**: [https://bijeshsharam.com.np](https://bijeshsharam.com.np)
- **License**: MIT
