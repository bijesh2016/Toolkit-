import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  ExternalLink, 
  Compass, 
  Terminal, 
  Cpu, 
  Globe, 
  Code2,
  Mail, 
  Crown,
  MapPin
} from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#1e2129] bg-[#08090b] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Top Personal Creator Showcase Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Creator Monogram Avatar */}
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-display font-bold text-indigo-300 text-lg shrink-0">
              BS
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Bijesh Sharma
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Creator & Engineer
                </span>
                <span className="text-[10px] font-medium flex items-center gap-1 text-slate-400 font-mono">
                  <MapPin className="w-3 h-3 text-rose-400" /> Kathmandu, Nepal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed font-sans">
                Dedicated to engineering fast, private, ad-free web software. Every tool is 100% free forever for students, developers, freelancers, and businesses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto">
            <a
              href="https://bijeshsharam.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>bijeshsharam.com.np</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/api-docs"
              onClick={playPopSound}
              className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-200 text-xs font-semibold border border-[#222631] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Swagger API</span>
            </Link>
          </div>
        </div>

        {/* 4 Categorized Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-sans">
          {/* Column 1: Nepal Suite */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Nepal Localization</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/tools/bs-ad-converter" className="hover:text-indigo-400 transition-colors">Universal BS-AD Calendar</Link></li>
              <li><Link to="/tools/nepali-unicode" className="hover:text-indigo-400 transition-colors">Devanagari Unicode Typing</Link></li>
              <li><Link to="/tools/language-translator" className="hover:text-indigo-400 transition-colors">English ↔ Nepali Translator</Link></li>
              <li><Link to="/tools/npr-to-words" className="hover:text-indigo-400 transition-colors">NPR Amount in Words</Link></li>
              <li><Link to="/tools/nepali-invoice" className="hover:text-indigo-400 transition-colors">IRD-Compliant Tax Invoice</Link></li>
              <li><Link to="/tools/nepal-locations" className="hover:text-indigo-400 transition-colors">7 Provinces & 77 Districts</Link></li>
            </ul>
          </div>

          {/* Column 2: Developer Utilities */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Developer Suite</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/tools/json-formatter" className="hover:text-indigo-400 transition-colors">JSON Formatter & Validator</Link></li>
              <li><Link to="/tools/jwt-decoder" className="hover:text-indigo-400 transition-colors">JWT Token Claim Decoder</Link></li>
              <li><Link to="/tools/regex-tester" className="hover:text-indigo-400 transition-colors">Regex Pattern Tester</Link></li>
              <li><Link to="/tools/sql-formatter" className="hover:text-indigo-400 transition-colors">SQL Query Beautifier</Link></li>
              <li><Link to="/tools/base64-converter" className="hover:text-indigo-400 transition-colors">Base64 & Hex Encoder</Link></li>
              <li><Link to="/tools/timestamp-converter" className="hover:text-indigo-400 transition-colors">Epoch Timestamp Converter</Link></li>
            </ul>
          </div>

          {/* Column 3: Security & Design */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Security & Image</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/tools/media-downloader" className="hover:text-indigo-400 transition-colors text-rose-300 font-medium">Universal Video & MP3 Downloader</Link></li>
              <li><Link to="/tools/playlist-downloader" className="hover:text-indigo-400 transition-colors text-rose-300 font-medium">YouTube Playlist Downloader</Link></li>
              <li><Link to="/tools/temp-email" className="hover:text-indigo-400 transition-colors">Disposable Email & OTP Inbox</Link></li>
              <li><Link to="/tools/qr-generator" className="hover:text-indigo-400 transition-colors">Pro QR Code Designer</Link></li>
              <li><Link to="/tools/document-scanner" className="hover:text-indigo-400 transition-colors">Document Scanner & PDF Maker</Link></li>
              <li><Link to="/tools/url-inspector" className="hover:text-indigo-400 transition-colors">SSRF-Protected Header Checker</Link></li>
              <li><Link to="/tools/password-generator" className="hover:text-indigo-400 transition-colors">Entropy Password Generator</Link></li>
              <li><Link to="/tools/image-compressor" className="hover:text-indigo-400 transition-colors">In-Browser Image Compressor</Link></li>
              <li><Link to="/tools/color-palette" className="hover:text-indigo-400 transition-colors">Harmonious Color Palette</Link></li>
            </ul>
          </div>

          {/* Column 4: Productivity & Pro */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-display text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Productivity & Pro</span>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors text-amber-300 font-medium">Pro Tier & Pricing (NPR 499)</Link></li>
              <li><Link to="/tools/pomodoro-timer" className="hover:text-indigo-400 transition-colors">Pomodoro Focus Timer</Link></li>
              <li><Link to="/tools/resume-builder" className="hover:text-indigo-400 transition-colors">Resume & CV Builder</Link></li>
              <li><Link to="/tools/word-counter" className="hover:text-indigo-400 transition-colors">Word & Reading Counter</Link></li>
              <li><Link to="/tools/loan-emi-calculator" className="hover:text-indigo-400 transition-colors">Loan EMI & Interest Calculator</Link></li>
              <li><Link to="/api-docs" className="hover:text-indigo-400 transition-colors">Swagger API Documentation</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1e2129] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">All 50+ Microservices Operational</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">100% In-Browser Privacy</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Bijesh Tools Hub. Handcrafted with precision in Nepal (नेपाल).</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
