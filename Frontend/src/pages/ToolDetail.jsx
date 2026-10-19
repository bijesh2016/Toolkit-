import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TOOLS_LIST, CATEGORIES } from '../data/toolsData';

// Developer
import JsonFormatter from '../tools/developer/JsonFormatter';
import JwtDecoder from '../tools/developer/JwtDecoder';
import Base64Converter from '../tools/developer/Base64Converter';
import RegexTester from '../tools/developer/RegexTester';
import SqlFormatter from '../tools/developer/SqlFormatter';
import UuidGenerator from '../tools/developer/UuidGenerator';
import TimestampConverter from '../tools/developer/TimestampConverter';

// Nepal
import BsAdConverter from '../tools/nepal/BsAdConverter';
import NepaliUnicodeTyping from '../tools/nepal/NepaliUnicodeTyping';
import NprToWords from '../tools/nepal/NprToWords';
import NepalLocations from '../tools/nepal/NepalLocations';
import NepaliInvoice from '../tools/nepal/NepaliInvoice';

// Document
import WordCounter from '../tools/document/WordCounter';
import ImageToPdf from '../tools/document/ImageToPdf';
import DocumentScanner from '../tools/document/DocumentScanner';
import ResumeBuilder from '../tools/document/ResumeBuilder';
import InvoiceGenerator from '../tools/document/InvoiceGenerator';
import CertificateMaker from '../tools/document/CertificateMaker';

// Image
import ImageCompressor from '../tools/image/ImageCompressor';
import QrGenerator from '../tools/image/QrGenerator';
import ColorPalette from '../tools/image/ColorPalette';
import CssGenerators from '../tools/image/CssGenerators';

// Calculator
import PercentageCalculator from '../tools/calculator/PercentageCalculator';
import LoanEmiCalculator from '../tools/calculator/LoanEmiCalculator';
import VatCalculator from '../tools/calculator/VatCalculator';
import AgeCalculator from '../tools/calculator/AgeCalculator';

// Student
import GpaCalculator from '../tools/student/GpaCalculator';
import PomodoroTimer from '../tools/student/PomodoroTimer';
import FlashcardMaker from '../tools/student/FlashcardMaker';

// Text
import CaseConverter from '../tools/text/CaseConverter';
import TextDiff from '../tools/text/TextDiff';
import SlugGenerator from '../tools/text/SlugGenerator';
import LanguageTranslator from '../tools/text/LanguageTranslator';

// Web & Security
import MetaTagGenerator from '../tools/web/MetaTagGenerator';
import RobotsSitemapGenerator from '../tools/web/RobotsSitemapGenerator';
import UrlInspector from '../tools/web/UrlInspector';
import PasswordGenerator from '../tools/security/PasswordGenerator';
import HashGenerator from '../tools/security/HashGenerator';
import SecretRedactor from '../tools/security/SecretRedactor';
import TempEmailGenerator from '../tools/security/TempEmailGenerator';
import MediaDownloader from '../tools/media/MediaDownloader';
import PlaylistDownloader from '../tools/media/PlaylistDownloader';

// AI
import AiSummarizer from '../tools/ai/AiSummarizer';
import AiCodeExplainer from '../tools/ai/AiCodeExplainer';

const COMPONENT_MAP = {
  // Nepal
  'bs-ad-converter': BsAdConverter,
  'nepali-unicode': NepaliUnicodeTyping,
  'npr-to-words': NprToWords,
  'nepal-locations': NepalLocations,
  'nepali-invoice': NepaliInvoice,
  'language-translator': LanguageTranslator,

  // Developer
  'json-formatter': JsonFormatter,
  'jwt-decoder': JwtDecoder,
  'base64-converter': Base64Converter,
  'regex-tester': RegexTester,
  'sql-formatter': SqlFormatter,
  'uuid-generator': UuidGenerator,
  'timestamp-converter': TimestampConverter,

  // Document
  'word-counter': WordCounter,
  'image-to-pdf': ImageToPdf,
  'document-scanner': DocumentScanner,
  'resume-builder': ResumeBuilder,
  'invoice-generator': InvoiceGenerator,
  'certificate-maker': CertificateMaker,

  // Image
  'image-compressor': ImageCompressor,
  'qr-generator': QrGenerator,
  'color-palette': ColorPalette,
  'css-generators': CssGenerators,

  // Calculator
  'percentage-calculator': PercentageCalculator,
  'loan-emi-calculator': LoanEmiCalculator,
  'vat-calculator': VatCalculator,
  'age-calculator': AgeCalculator,

  // Student
  'gpa-calculator': GpaCalculator,
  'pomodoro-timer': PomodoroTimer,
  'flashcard-maker': FlashcardMaker,

  // Text
  'case-converter': CaseConverter,
  'text-diff': TextDiff,
  'slug-generator': SlugGenerator,

  // Web & Security
  'meta-tag-generator': MetaTagGenerator,
  'robots-sitemap': RobotsSitemapGenerator,
  'url-inspector': UrlInspector,
  'password-generator': PasswordGenerator,
  'hash-generator': HashGenerator,
  'secret-redactor': SecretRedactor,
  'temp-email': TempEmailGenerator,
  'media-downloader': MediaDownloader,
  'playlist-downloader': PlaylistDownloader,

  // AI
  'ai-summarizer': AiSummarizer,
  'ai-code-explainer': AiCodeExplainer
};

import { isFavorite as checkIsFav, toggleFavorite as toggleFav, addRecentTool } from '../utils/storage';
import { playPopSound } from '../utils/soundEffects';

export default function ToolDetail({ onShowToast, onOpenPricing }) {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorite, setFavorite] = useState(() => checkIsFav(toolId));

  const tool = TOOLS_LIST.find(t => t.id === toolId);
  const ToolComponent = COMPONENT_MAP[toolId];

  // Track recent tool
  React.useEffect(() => {
    if (toolId) {
      addRecentTool(toolId);
      setFavorite(checkIsFav(toolId));
    }
  }, [toolId]);

  if (!tool || !ToolComponent) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white">Tool Not Found</h2>
        <p className="text-slate-400 text-xs mt-2">The requested tool does not exist or has been moved.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to Tools Directory
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    playPopSound();
    navigator.clipboard.writeText(window.location.href);
    if (onShowToast) onShowToast('Copied direct tool link to clipboard!');
  };

  const handleToggleFav = () => {
    playPopSound();
    const nextState = toggleFav(tool.id);
    setFavorite(nextState);
    if (onShowToast) onShowToast(nextState ? `Saved ${tool.name} to Favorites! ⭐` : `Removed ${tool.name} from Favorites`);
  };

  const relatedTools = TOOLS_LIST.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  return (
    <div className={`space-y-8 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0b0c0e] p-6 overflow-y-auto' : ''}`}>
      {/* Top Header & Breadcrumb */}
      <div className="no-print p-6 sm:p-7 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-medium">
            <Link to="/" className="hover:text-indigo-400 transition-colors">Tools Hub</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to={`/categories/${tool.category}`} className="hover:text-indigo-400 uppercase tracking-wider transition-colors font-mono text-[11px]">
              {tool.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-semibold">{tool.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {tool.name}
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {tool.badge}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              ✦ Local &lt;2ms
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
            {tool.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 relative z-10 self-start md:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181b22] border border-[#222631] text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client Privacy</span>
          </div>

          {/* Star Favorite Button */}
          <button
            onClick={handleToggleFav}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              favorite
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-[#181b22] border-[#222631] text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
            }`}
            title={favorite ? 'Starred in Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-4 h-4 ${favorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[#181b22] border border-[#222631] hover:border-[#323846] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Share this tool"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-[#181b22] border border-[#222631] hover:border-[#323846] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Workspace'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Tool Component Canvas */}
      <div className="py-2">
        <ToolComponent onShowToast={onShowToast} onOpenPricing={onOpenPricing} />
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && !isFullscreen && (
        <div className="no-print pt-10 border-t border-[#222631]">
          <h3 className="font-display text-lg font-bold text-white mb-4">Related Utilities in {tool.category.toUpperCase()}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map(rt => (
              <Link
                key={rt.id}
                to={rt.route}
                className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] hover:bg-[#181b22] shadow-sm transition-all group cursor-pointer"
              >
                <div className="font-display font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {rt.name}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">{rt.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
