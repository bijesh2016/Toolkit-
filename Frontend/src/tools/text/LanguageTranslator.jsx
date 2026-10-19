import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, ArrowRightLeft, Copy, Check, Download, Trash2, 
  Volume2, Mic, MicOff, Sparkles, BookOpen, RefreshCw, Globe, 
  ChevronDown, ExternalLink, MessageSquareQuote
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

export const SUPPORTED_LANGUAGES = [
  { code: 'ne', name: 'Nepali (नेपाली)', flag: '🇳🇵', speechCode: 'ne-NP' },
  { code: 'en', name: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷', speechCode: 'ko-KR' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦', speechCode: 'ar-SA' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇵🇹', speechCode: 'pt-PT' },
  { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇧🇩', speechCode: 'bn-BD' },
  { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹', speechCode: 'it-IT' }
];

export const QUICK_PAIRS = [
  { from: 'en', to: 'ne', label: 'English → Nepali' },
  { from: 'ne', to: 'en', label: 'Nepali → English' },
  { from: 'en', to: 'hi', label: 'English → Hindi' },
  { from: 'en', to: 'ja', label: 'English → Japanese' },
  { from: 'en', to: 'ko', label: 'English → Korean' },
  { from: 'en', to: 'es', label: 'English → Spanish' }
];

export const PHRASEBOOK_CATEGORIES = [
  {
    category: 'Greetings & Courtesy (अभिवादन)',
    phrases: [
      { text: 'Hello, namaste! Welcome to Nepal.', note: 'Friendly welcome' },
      { text: 'How are you? I hope you are doing well.', note: 'Polite inquiry' },
      { text: 'Thank you very much for your great help.', note: 'Gratitude' },
      { text: 'Excuse me, could you please guide me?', note: 'Polite request' },
      { text: 'It was very nice meeting you today.', note: 'Parting' }
    ]
  },
  {
    category: 'Travel & Navigation (यात्रा र बाटो)',
    phrases: [
      { text: 'Where is the bus park for Pokhara?', note: 'Bus terminal inquiry' },
      { text: 'How far is Tribhuvan International Airport from here?', note: 'Airport distance' },
      { text: 'How much is the taxi fare to Thamel?', note: 'Taxi pricing' },
      { text: 'Can you please show me the way on the map?', note: 'Navigation assistance' },
      { text: 'Is it safe to trek to Annapurna Base Camp this month?', note: 'Trekking advice' }
    ]
  },
  {
    category: 'Dining & Commerce (खाना र किनमेल)',
    phrases: [
      { text: 'Please bring one cup of black tea without sugar.', note: 'Tea order' },
      { text: 'Is this traditional Nepali dish very spicy?', note: 'Spiciness check' },
      { text: 'How much does this Pashmina shawl cost?', note: 'Price inquiry' },
      { text: 'Can you please give a reasonable discount for students?', note: 'Discount request' },
      { text: 'Where can I pay using Fonepay or digital QR?', note: 'Digital payment' }
    ]
  },
  {
    category: 'Emergency & Medical (आपतकालीन)',
    phrases: [
      { text: 'Please help me, it is an emergency!', note: 'Urgent distress' },
      { text: 'Where is the nearest 24-hour pharmacy or hospital?', note: 'Hospital locator' },
      { text: 'I lost my passport and travel documents.', note: 'Lost property' },
      { text: 'Please call the tourist police immediately.', note: 'Police contact' }
    ]
  },
  {
    category: 'Academic & Professional (अध्ययन र काम)',
    phrases: [
      { text: 'I am preparing for the public service Lok Sewa examination.', note: 'Exam study' },
      { text: 'I would like to apply for the software developer internship.', note: 'Job application' },
      { text: 'Could you please review and sign this agreement document?', note: 'Official paperwork' },
      { text: 'Looking forward to hearing from you soon.', note: 'Formal correspondence' }
    ]
  }
];

export default function LanguageTranslator({ onShowToast }) {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ne');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [showPhrasebook, setShowPhrasebook] = useState(false);

  const debounceTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
        if (onShowToast) onShowToast('Voice speech recognized!');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onShowToast]);

  // Main translation function
  const performTranslation = async (textToTranslate, fromLang, toLang) => {
    const text = (textToTranslate || '').trim();
    if (!text) {
      setOutputText('');
      setStatusMsg('');
      setIsLoading(false);
      return;
    }

    if (fromLang === toLang) {
      setOutputText(text);
      setStatusMsg('Source and target languages are identical');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setStatusMsg('Translating...');

    try {
      // 1. Try Backend Proxy with in-memory LRU caching
      const backendRes = await fetch('/api/tools/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from: fromLang, to: toLang })
      });

      if (backendRes.ok) {
        const json = await backendRes.json();
        if (json.success && json.data?.translatedText) {
          setOutputText(json.data.translatedText);
          setStatusMsg(json.data.cached ? '✦ Instant cached translation' : '✓ Translation complete');
          setIsLoading(false);
          return;
        }
      }

      // 2. Direct client-side fallback if backend is unreachable
      const pair = `${fromLang}|${toLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`;
      const fallbackRes = await fetch(url);
      const fallbackJson = await fallbackRes.json();

      if (fallbackJson?.responseData?.translatedText) {
        setOutputText(fallbackJson.responseData.translatedText);
        setStatusMsg('✓ Translation complete');
      } else {
        setStatusMsg('Could not fetch translation. Please check connection.');
      }
    } catch (err) {
      setStatusMsg('Translation error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced auto-translation on input change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!inputText.trim()) {
      setOutputText('');
      setStatusMsg('');
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText, sourceLang, targetLang);
    }, 600);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, sourceLang, targetLang]);

  // Swap Languages
  const handleSwapLanguages = () => {
    playClickSound();
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevInput = inputText;
    const prevOutput = outputText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setInputText(prevOutput);
    setOutputText(prevInput);
  };

  // Copy output
  const handleCopy = () => {
    if (!outputText) return;
    playClickSound();
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    if (onShowToast) onShowToast('Translated text copied to clipboard!');
  };

  // Download output
  const handleDownload = () => {
    if (!outputText) return;
    playClickSound();
    const sourceObj = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang);
    const targetObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);

    const content = `=== Bijesh Tools Hub Translation ===\nFrom: ${sourceObj?.name || sourceLang}\nTo: ${targetObj?.name || targetLang}\n\nORIGINAL TEXT:\n${inputText}\n\nTRANSLATED TEXT:\n${outputText}\n\nTranslated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-${sourceLang}-to-${targetLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Downloaded translation file!');
  };

  // Text-To-Speech (Pronounce Audio)
  const handleSpeak = (text, langCode, isSource) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

    playClickSound();
    window.speechSynthesis.cancel();

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langObj?.speechCode || langCode;
    utterance.rate = 0.95;

    if (isSource) {
      setIsSpeakingSource(true);
      utterance.onend = () => setIsSpeakingSource(false);
      utterance.onerror = () => setIsSpeakingSource(false);
    } else {
      setIsSpeakingTarget(true);
      utterance.onend = () => setIsSpeakingTarget(false);
      utterance.onerror = () => setIsSpeakingTarget(false);
    }

    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (Voice Typing)
  const toggleListening = () => {
    playClickSound();
    if (!recognitionRef.current) {
      if (onShowToast) onShowToast('Voice recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const sourceObj = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang);
      recognitionRef.current.lang = sourceObj?.speechCode || 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
      if (onShowToast) onShowToast(`Listening in ${sourceObj?.name}...`);
    }
  };

  // Select phrase from Phrasebook
  const handleSelectPhrase = (phraseText) => {
    playClickSound();
    setInputText(phraseText);
    setSourceLang('en');
    setTargetLang('ne');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Nepali & Multi-Language Translator
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                English ⇄ Nepali Spotlight
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Translate between Nepali, English, Hindi, Japanese, Korean, and 10+ global languages with pronunciation
            </p>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); setShowPhrasebook(!showPhrasebook); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            showPhrasebook 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {showPhrasebook ? 'Hide Phrasebook' : 'Nepali Phrasebook (शब्दावली)'}
        </button>
      </div>

      {/* Quick Language Pair Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Pairs:</span>
        {QUICK_PAIRS.map(pair => (
          <button
            key={`${pair.from}-${pair.to}`}
            onClick={() => {
              playClickSound();
              setSourceLang(pair.from);
              setTargetLang(pair.to);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              sourceLang === pair.from && targetLang === pair.to
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {pair.label}
          </button>
        ))}
      </div>

      {/* Interactive Translation Workplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
        {/* Source Language Pane */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col h-96 shadow-xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">From:</span>
              <select
                value={sourceLang}
                onChange={(e) => { playClickSound(); setSourceLang(e.target.value); }}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleListening}
                className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                  isListening 
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={isListening ? 'Stop listening' : 'Voice Typing (Dictate)'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleSpeak(inputText, sourceLang, true)}
                disabled={!inputText || isSpeakingSource}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-400 hover:text-slate-200 transition-colors"
                title="Listen to original pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type or paste ${SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || ''} text here...`}
            className="flex-1 w-full bg-transparent text-slate-100 placeholder-slate-600 resize-none py-3 focus:outline-none text-sm leading-relaxed"
          />

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{inputText.length} characters • {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
            <button
              onClick={() => { playClickSound(); setInputText(''); setOutputText(''); setStatusMsg(''); }}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Floating Swap Button in between panels */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleSwapLanguages}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl flex items-center justify-center border-2 border-slate-900 hover:rotate-180 transition-all duration-300"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Target Language Pane */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/20 flex flex-col h-96 shadow-xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">To:</span>
              <select
                value={targetLang}
                onChange={(e) => { playClickSound(); setTargetLang(e.target.value); }}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeak(outputText, targetLang, false)}
                disabled={!outputText || isSpeakingTarget}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
                title="Listen to translation pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputText}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
                title="Download translation text"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={outputText}
            readOnly
            placeholder={isLoading ? 'Translating text in real-time...' : 'Translation will appear here...'}
            className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-base leading-relaxed font-devanagari"
          />

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-2">
              {isLoading && <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />}
              <span className={statusMsg.includes('Cached') ? 'text-amber-400' : 'text-slate-400'}>
                {statusMsg || `${outputText.length} characters`}
              </span>
            </span>

            <button
              onClick={() => performTranslation(inputText, sourceLang, targetLang)}
              disabled={isLoading || !inputText.trim()}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 disabled:opacity-40 font-medium transition-all flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Translate Now
            </button>
          </div>
        </div>
      </div>

      {/* Nepali Conversational Phrasebook (Collapsible) */}
      {showPhrasebook && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-5 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400">
              <MessageSquareQuote className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">
                Essential Nepali Conversational Phrasebook (नेपाली कुराकानी डायलग)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Click any phrase to translate to Nepali</span>
          </div>

          <div className="space-y-4">
            {PHRASEBOOK_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {cat.category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.phrases.map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSelectPhrase(phrase.text)}
                      className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                        "{phrase.text}"
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> {phrase.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
