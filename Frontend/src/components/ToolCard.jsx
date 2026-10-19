import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Keyboard, 
  Coins, 
  MapPin, 
  Receipt,
  FileCode2,
  Key,
  Binary,
  Regex as RegexIcon,
  Database,
  Fingerprint,
  Clock,
  FileText,
  FileUp,
  UserCheck,
  DollarSign,
  Award,
  Minimize2,
  QrCode,
  Palette,
  Layers,
  Percent,
  Banknote,
  CreditCard,
  Hourglass,
  GraduationCap,
  Timer,
  BookOpen,
  Type,
  GitCompare,
  Link as LinkIcon,
  Share2,
  FileCode,
  Globe,
  Lock,
  Hash,
  ShieldAlert,
  Cpu,
  Mail,
  Languages,
  ScanLine,
  Video,
  Music,
  ListMusic
} from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

const ICON_MAP = {
  Calendar, Keyboard, Coins, MapPin, Receipt,
  FileCode2, Key, Binary, Regex: RegexIcon, Database,
  Fingerprint, Clock, FileText, FileUp, UserCheck,
  DollarSign, Award, Minimize2, QrCode, Palette,
  Layers, Percent, Banknote, CreditCard, Hourglass,
  GraduationCap, Timer, BookOpen, Type, GitCompare,
  Link: LinkIcon, Share2, FileCode, Globe, Lock,
  Hash, ShieldAlert, Sparkles, Cpu, Mail, Languages, ScanLine, Video, Music, ListMusic
};

// Subtle, elegant category accent tags
const CATEGORY_STYLES = {
  nepal: {
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },
  developer: {
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
  security: {
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  text: {
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  },
  finance: {
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  student: {
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  image: {
    iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  }
};

export default function ToolCard({ tool }) {
  const IconComponent = ICON_MAP[tool.icon] || Sparkles;
  const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.developer;

  return (
    <Link
      to={tool.route}
      onClick={playPopSound}
      className="group relative p-5 sm:p-6 rounded-2xl bg-[#13151b] border border-[#222631] hover:border-[#323846] hover:bg-[#181b22] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl border transition-all duration-200 group-hover:scale-105 ${style.iconBg}`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badge}`}>
            {tool.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors duration-200">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mt-2">
          {tool.description}
        </p>
      </div>

      {/* Card Footer Link */}
      <div className="mt-6 pt-3.5 border-t border-[#222631] flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
        <span>Open Utility</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </Link>
  );
}
